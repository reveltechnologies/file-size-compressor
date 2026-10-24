# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--- To add private notes or comments in this changelog that won't show in the rendered release, use markdown comments like this. -->

## [1.0.0] - 2026-10-24

### Added
- Universal CodeQL security workflow (`codeql.yml`) using `codeql-action@v4` with dynamic multi-language detection.
- Automated repository visibility check skipping CodeQL on private repositories to avoid Advanced Security license errors.
- Automated release workflow (`release-from-changelog.yml`) syncing GitHub releases and comparison links.
- Automated `SECURITY.md` management tracking the latest major release.
- Wiki synchronization workflow (`wiki-sync.yml`) mirroring `docs/` to GitHub Wiki.
- Multi-branch documentation, workflow, and metadata sync (`sync-documentation.yml`).
- Centralized configuration file (`config.yaml`).
- Default documentation landing page (`docs/Home.md`) and navigation (`docs/_Sidebar.md`).
- Issue templates for bug reports and feature requests (`.github/ISSUE_TEMPLATE/`).
- Pull request template (`.github/pull_request_template.md`).
- Dependabot configuration for GitHub Actions (`.github/dependabot.yml`).
- Contributor Covenant Code of Conduct (`CODE_OF_CONDUCT.md`).
- Universal contribution guide (`CONTRIBUTING.md`).
- Template license guide (`LICENSE`).
- Universal `.gitattributes` and expanded `.gitignore`.
- Template setup and quickstart guide (`README.md`).
- test

## [1.0.0-rc.1] - 2026-10-20
<!-- EXAMPLE: Use '-rc.X' for Release Candidates. The release action will automatically mark it as a Pre-release on GitHub. -->

### Added
- Example testing notes for documentation synchronization.
- Example entry showing how to document new configuration additions.

### Changed
- Standardized file paths across workflow triggers.

## [1.0.0-beta.1] - 2026-10-15
<!-- EXAMPLE: Use '-beta.X' for Beta builds. You can add sections like Added, Changed, Fixed, or Removed. -->

### Added
- Example beta features and testing notes.

### Fixed
- Example bugfix note describing resolved issues.

## [1.0.0-alpha.1] - 2026-10-10
<!-- EXAMPLE: Use '-alpha.X' for early preview builds. You can replace, edit, or delete these example sections at any time. -->

### Added
- Prototype notes and initial experimental features.
