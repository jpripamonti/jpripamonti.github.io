# Third-Party Notices

This file documents third-party frontend assets vendored in this repository.
It is not a substitute for the upstream licenses.

## Font Awesome 4.7.0

- Path: `libs/external/font-awesome-4.7.0/`
- Upstream: https://fontawesome.com/v4/
- Local evidence: `libs/external/font-awesome-4.7.0/css/font-awesome.css`
- License summary: font files under SIL OFL 1.1; CSS under MIT; icons under CC BY 4.0 per upstream Font Awesome 4 licensing.
- Use: social/link icons.

## Academicons 1.8.6

- Path: `libs/external/academicons-1.8.6/`
- Upstream: https://jpswalsh.github.io/academicons/
- Local evidence: `libs/external/academicons-1.8.6/README.md`
- License summary: fonts under SIL OFL 1.1, CSS under MIT, pictograms under CC BY 3.0.
- Use: academic profile icons.

## IBM Plex

- Path: `libs/fonts/`
- Upstream: https://github.com/IBM/plex
- Local evidence: `libs/fonts/OFL.txt`
- License summary: SIL OFL 1.1.
- Use: site typography. Families IBM Plex Sans and IBM Plex Serif, latin and latin-ext
  subsets only, self-hosted so that no third party is contacted when a page loads. The
  `@font-face` rules in `libs/fonts/fonts.css` were generated from the Google Fonts css2
  API and rewritten to point at the local files.

## Removed Dependencies

- jQuery 3.1.1 was removed from the active layout and vendored files in this branch. The remaining custom JavaScript uses native browser APIs.
- Unused Skeleton, skeleton_tabs, timeline.css, and Font Awesome LESS/SCSS source files were removed from the active vendored tree in this branch.
- The Google Analytics include and its measurement ID were removed. The site runs no analytics; see `privacy.html`.
