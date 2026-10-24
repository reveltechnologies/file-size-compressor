# Repository Template

A pre-configured repository template with automated security scanning, release management, documentation sync, and wiki mirroring.

---

## Quick Start

### Files to edit:
- **`README.md`**: Replace with your project's description and overview.
- **`config.yaml`**: Enable or disable automated features and customize sync items.
- **`LICENSE`**: Replace with your project's license (e.g., MIT, Apache 2.0).
- **`CHANGELOG.md`**: Add your version number and release notes.
- **`src/`**: Place your project source code files here.
- **`docs/`**: Add documentation pages to mirror to the repository Wiki (create a `Home` page in the **Wiki** tab first to initialize. If the Wiki tab is missing, enable it in **Settings** > **General** -> **Features**; note that wikis are not available on free private repositories).

### When you commit and push changes, it will automatically:
- **Run CodeQL security analysis** across all detected languages.
- **Create or update GitHub Releases** matching the version in `CHANGELOG.md` (with comparison links and prerelease tags).
- **Update `SECURITY.md`** to support the latest major version.
- **Sync documentation, workflows, and templates** across all other active branches.
- **Mirror `docs/` to GitHub Wiki** (once a Home page is created under the Wiki tab).

*(All automated actions can be toggled on or off in `config.yaml`)*
