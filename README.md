# jpripamonti.github.io

Source for the personal website of Juan Pablo Ripamonti.

## Development

This site is built with Jekyll using the Ruby and gem versions committed in
this repository.

```bash
bundle install
bundle exec jekyll serve
```

For a clean production-style build:

```bash
bundle exec jekyll build --strict_front_matter --trace
```

For audits, build to a temporary directory instead of relying on any existing
`_site/` output:

```bash
bundle exec jekyll build --destination /tmp/jpr_site_verify --disable-disk-cache --trace
```

`_site/` and `.jekyll-cache/` are generated artifacts and should not be edited
or reviewed as source.

## Distribution Notes

- macOS installer packages are not served directly from this site. If DualAudio
  binaries are published again, they should live in versioned releases with
  checksums, signing/notarization status, release notes, and install/uninstall
  instructions.
- Local replication data is only linked when it has been reviewed for
  anonymization, documentation, and reproducibility. Versioned dataset records
  should be cited through their DOI records.
- Analytics is disabled by default. If analytics is enabled later, update
  `privacy.html` and keep event collection minimized.

## Licensing

- Site code: GNU GPLv3, as declared in `LICENSE`.
- Text and academic metadata: all rights reserved unless a page or linked source
  says otherwise.
- Datasets: use the license and citation terms on the canonical DOI/Dataverse
  record.
- PDFs, appendices, images, and binary software artifacts: not covered by the
  site-code license unless explicitly stated.
- Third-party frontend assets: see `THIRD_PARTY_NOTICES.md`.
