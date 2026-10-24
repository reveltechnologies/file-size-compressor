# Documentation & Wiki Guide

Welcome to the project documentation. Files placed in this `docs/` folder are automatically mirrored to the repository's GitHub Wiki via the wiki sync workflow.

---

## Getting Started

1. **Initialize the Wiki** (First-time setup only):
   - Go to your repository's **Wiki** tab on GitHub.
   - Click **Create the first page** and save it (naming it `Home`). This initializes the wiki repository remote.
2. **Add Documentation**:
   - Create Markdown (`.md`) files inside `docs/`.
   - Push your changes to the default branch; the sync workflow will publish them automatically.

---

## Special File Names

GitHub Wiki uses specific reserved file names for layout elements:

| File Name | Purpose |
| --- | --- |
| `Home.md` | The landing page of your wiki. |
| `_Sidebar.md` | Content displayed in the navigation sidebar across all wiki pages. |
| `_Footer.md` | Content displayed at the bottom of every wiki page. |

---

## Structuring Pages

- Name pages with regular dashes or hyphens (e.g., `Getting-Started.md`, `API-Reference.md`).
- Link between pages using standard Markdown syntax:
  ```markdown
  [Getting Started](Getting-Started)
  [API Reference](API-Reference)
  ```
- Use `_Sidebar.md` to organize your table of contents and navigation hierarchy.
