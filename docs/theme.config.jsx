export default {
  logo: <span style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>GradLab</span>,
  project: {
    link: 'https://github.com/Super-bob3/GradLab',
  },
  docsRepositoryBase: 'https://github.com/Super-bob3/GradLab/tree/main/docs',
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="GradLab — WebGL gradient engine with OKLab color science, 13 fluid algorithms, halftone, and ASCII matrix." />
      <meta property="og:title" content="GradLab Docs" />
      <meta property="og:description" content="Documentation for GradLab, a browser-based WebGL gradient tool." />
    </>
  ),
  useNextSeoProps() {
    return { titleTemplate: '%s – GradLab' }
  },
  primaryHue: 0,
  primarySaturation: 0,
  footer: {
    text: (
      <span>
        © {new Date().getFullYear()} GradLab ·{' '}
        <a href="https://gradlab.app" target="_blank" rel="noopener">
          Launch App
        </a>
      </span>
    ),
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
}
