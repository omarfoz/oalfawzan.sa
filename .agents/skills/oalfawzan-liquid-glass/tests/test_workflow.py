"""Run: python -m unittest discover -s tests -v (from the skill root)."""
import argparse
import subprocess
import tempfile
import unittest
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from scaffold import build_site
from validate import validate


class WorkflowTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def args(self, **extra):
        d = dict(output=str(self.root / "site"), kind="portfolio", name="Example Studio", headline="Real work, clearly presented", description="Small friendly web studio", email="hello@example.org", eyebrow="Portfolio", about="We make useful products", item=["Website|An independent project|https://example.org"] , background=None)
        d.update(extra)
        return argparse.Namespace(**d)

    def test_complete_portfolio_passes(self):
        out = build_site(self.args())
        self.assertEqual(validate(out), [])
        html = (out / "index.html").read_text()
        self.assertLess(html.index('class="og-nav"'), html.index('class="og-hero"'))
        self.assertIn('class="og-grid"', html)
        self.assertIn('href="https://example.org"', html)
        self.assertEqual(html.count('<h1'), 1)
        self.assertTrue((out / "assets/theme.js").is_file())

    def test_minimum_landing_passes_without_fake_projects(self):
        out = build_site(self.args(kind="landing", about="", item=[]))
        self.assertEqual(validate(out), [])
        html = (out / "index.html").read_text()
        self.assertNotIn('id="work"', html)
        self.assertNotIn('href="#work"', html)
        self.assertNotIn('id="about"', html)

    def test_copy_is_safe_from_html_injection(self):
        out = build_site(self.args(name='<script>alert(1)</script>', headline='"Trust" & Delight', item=[]))
        html = (out / "index.html").read_text()
        self.assertNotIn('<script>alert(1)</script>', html)
        self.assertIn('&lt;script&gt;', html)
        self.assertIn('&quot;Trust&quot; &amp; Delight', html)
        self.assertEqual(validate(out), [])

    def test_reject_existing_content(self):
        folder = self.root / "site"
        folder.mkdir()
        (folder / "important.txt").write_text('keep')
        with self.assertRaisesRegex(ValueError, "not empty"):
            build_site(self.args())
        self.assertEqual((folder / "important.txt").read_text(), 'keep')

    def test_invalid_email_no_output(self):
        with self.assertRaisesRegex(ValueError, 'valid --email'):
            build_site(self.args(email='invalid email'))
        self.assertFalse((self.root / 'site').exists())

    def test_invalid_background_no_partial_output(self):
        with self.assertRaisesRegex(ValueError, 'background'):
            build_site(self.args(background=str(self.root / 'not-here.png')))
        self.assertFalse((self.root / 'site').exists())

    def test_owned_backdrop_is_copied(self):
        image = self.root / "mine.webp"
        image.write_bytes(b"RIFFtestWEBP")
        out = build_site(self.args(background=str(image)))
        self.assertTrue((out / 'assets/backdrop.webp').is_file())
        self.assertIn('url("./backdrop.webp")', (out / 'assets/oalfawzan.css').read_text())
        self.assertEqual(validate(out), [])

    def test_bad_item_format_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Title\|Description\|URL'):
            build_site(self.args(item=['NotEnoughFields']))

    def test_bad_anchor_rejected_before_write(self):
        with self.assertRaisesRegex(ValueError, 'real section'):
            build_site(self.args(item=['Thing|Description|#bogus']))
        self.assertFalse((self.root / 'site').exists())

    def test_nav_after_hero_fails(self):
        out = build_site(self.args())
        f = out / 'index.html'
        s = f.read_text()
        start = s.index('    <header>')
        end = s.index('    <main id="main">')
        nav_block = s[start:end]
        s = s[:start] + s[end:]
        pos = s.index('      <section class="og-section" id="about"')
        s = s[:pos] + nav_block + s[pos:]
        f.write_text(s)
        self.assertTrue(any('BEFORE the hero' in err for err in validate(out)))

    def test_missing_js_fails(self):
        out = build_site(self.args())
        (out / 'assets/theme.js').unlink()
        self.assertTrue(any('Broken local reference' in err for err in validate(out)))

    def test_inert_button_fails(self):
        out = build_site(self.args())
        f = out / 'index.html'
        f.write_text(f.read_text().replace('    </main>', '      <button type="button">Learn More</button>\n    </main>'))
        self.assertTrue(any('Inert button' in err for err in validate(out)))

    def test_missing_anchor_target_fails(self):
        out = build_site(self.args())
        f = out / 'index.html'
        f.write_text(f.read_text().replace('href="#contact"', 'href="#missing"'))
        self.assertTrue(any('Missing anchor target' in err for err in validate(out)))

    def test_missing_theme_bootstrap_fails(self):
        out = build_site(self.args())
        f = out / 'index.html'
        f.write_text(f.read_text().replace('localStorage.getItem("oalfawzan-theme")', 'localStorage.getItem("other-theme")'))
        self.assertTrue(any('bootstrap' in err.lower() for err in validate(out)))

    def test_cli_and_validation_smoke(self):
        output = self.root / 'via-cli'
        r = subprocess.run([sys.executable, str(ROOT / 'scripts/scaffold.py'), '--output', str(output), '--name', 'Demo', '--headline', 'Real headline', '--description', 'This is our site', '--email', 'contact@example.org'], capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stderr)
        r = subprocess.run([sys.executable, str(ROOT / 'scripts/validate.py'), '--site', str(output)], capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn('PASS', r.stdout)


if __name__ == '__main__':
    unittest.main()
