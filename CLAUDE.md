# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a HubSpot CMS marketing website repository containing two themes:
- **roller-theme**: Main theme for the Roller marketing website (located in `/roller-theme`)
- **rolls-theme**: Alternative theme with build assets (located in `/rolls-theme`)

Both themes follow HubSpot CMS development patterns and are built for the Roller venue management platform marketing site.

## Project Structure

### Key Directories
- `/roller-theme/`: Main production theme
  - `/modules/`: HubSpot modules (reusable components)
  - `/templates/`: Page templates and layouts
  - `/css/`: Stylesheets
  - `/js/`: JavaScript files (using HubL includes)
  - `/images/`: Theme assets

- `/rolls-theme/`: Alternative theme with build process
  - `/dist/`: Compiled assets
  - `/build/`: Build output files
  - `/modules/`: Source modules
  - `/sections/`: Page sections
  - `/templates/`: Page templates

## HubSpot CMS Development

### File Types
- `.html` files: HubSpot templates using HubL templating language
- `.module/`: Module directories containing `module.html`, `module.css`, `module.js`, `fields.json`, and `meta.json`
- `.json` files: Configuration for themes, modules, and fields

### HubL Templating
Templates use HubL (HubSpot's templating language) with syntax like:
- `{% extends %}`, `{% block %}`, `{% include %}`
- `{{ variable }}` for outputting values
- Module includes: `{% module %}`, `{% dnd_module %}`

### Module Structure
Each module typically contains:
- `module.html`: Template markup
- `module.css`: Styles
- `module.js`: JavaScript
- `fields.json`: Field definitions
- `meta.json`: Module metadata

## Important Notes

1. **Theme Fields**: The roller-theme is NOT using theme fields - ignore `fields.json` at theme root
2. **Build Process**: The rolls-theme has a `/dist` directory with compiled assets and a `/build` directory
3. **Template Inheritance**: Templates extend from `layouts/base.html`
4. **JavaScript Organization**: Main JS files use HubL includes to combine multiple JS files

## Git Workflow

Current branch structure shows significant changes between `rolls-theme/src` (deleted) and `rolls-theme/dist` (added), indicating a recent build or refactoring process.

## Development Considerations

- All templates must include HubSpot template metadata comments
- Modules should be self-contained with their own styles and scripts
- Use absolute paths when referencing theme assets in HubL
- Follow HubSpot CMS best practices for responsive design and performance