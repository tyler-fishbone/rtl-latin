import { useState, type CSSProperties } from 'react';

type GlossMode = 'mirror' | 'plain';

type DemoExample = {
  id: string;
  language: string;
  nativeLabel: string;
  phoneticLabel: string;
  meaningLabel: string;
  nativeText: string;
  phoneticText: string;
  meaningText: string;
};

const MIRROR_FONT_STACK =
  '"RTL Latin", "RTLLatin", system-ui, sans-serif';

const EXAMPLES: DemoExample[] = [
  {
    id: 'hebrew',
    language: 'Hebrew',
    nativeLabel: 'Native',
    phoneticLabel: 'Phonetic',
    meaningLabel: 'Meaning',
    nativeText: 'שָׁלוֹם עוֹלָם',
    phoneticText: 'shalom olam',
    meaningText: 'peace world',
  },
  {
    id: 'arabic',
    language: 'Arabic',
    nativeLabel: 'Native',
    phoneticLabel: 'Phonetic',
    meaningLabel: 'Meaning',
    nativeText: 'السَّلَامُ عَلَيْكُمْ',
    phoneticText: 'as-salāmu ʿalaykum',
    meaningText: 'peace be upon you',
  },
];

function App() {
  const [mode, setMode] = useState<GlossMode>('mirror');
  const [fontSize, setFontSize] = useState(30);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  const copyCard = async (example: DemoExample) => {
    const block = [
      example.nativeText,
      example.phoneticText,
      example.meaningText,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(block);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = block;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopiedCardId(example.id);
    window.setTimeout(
      () => setCopiedCardId((current) => (current === example.id ? null : current)),
      1800,
    );
  };

  return (
    <main
      className="app-shell"
      style={
        {
          '--gloss-font-size': `${fontSize}px`,
          '--mirror-font-family': MIRROR_FONT_STACK,
        } as CSSProperties
      }
    >
      <section className="hero">
        <p className="eyebrow">Interlinear RTL Glossing Demo</p>
        <h1>RTL Latin gloss lines under Hebrew and Arabic</h1>
        <p className="intro">
          This proof of concept uses RTL Latin plus RTL CSS to make
          transliteration and meaning lines visually flow with Semitic source
          text. Switch modes to compare the mirrored presentation with ordinary
          LTR Latin text, and download the font files directly from this page.
        </p>
        <div className="hero-actions">
          <a className="download-link" href="/fonts/RTLLatin-Regular.otf" download>
            Download OTF
          </a>
          <a className="download-link download-link-secondary" href="/fonts/RTLLatin-Regular.woff2" download>
            Download WOFF2
          </a>
        </div>
      </section>

      <section className="control-panel" aria-label="Demo controls">
        <div className="mode-toggle" role="group" aria-label="Gloss display mode">
          <button
            type="button"
            className={mode === 'mirror' ? 'is-active' : ''}
            onClick={() => setMode('mirror')}
          >
            Mode A
            <span>Mirrored font + RTL</span>
          </button>
          <button
            type="button"
            className={mode === 'plain' ? 'is-active' : ''}
            onClick={() => setMode('plain')}
          >
            Mode B
            <span>Normal Latin + LTR</span>
          </button>
        </div>

        <label className="slider-field">
          <span>Font size</span>
          <input
            type="range"
            min="22"
            max="42"
            step="1"
            value={fontSize}
            onChange={(event) => setFontSize(Number(event.target.value))}
          />
          <strong>{fontSize}px</strong>
        </label>
      </section>

      <section className="card-grid">
        {EXAMPLES.map((example) => {
          const isCopied = copiedCardId === example.id;

          return (
            <article key={example.id} className="demo-card">
              <header className="card-header">
                <div>
                  <p className="card-kicker">{example.language}</p>
                  <h2>{example.language} Example</h2>
                </div>
                <button type="button" className="copy-button" onClick={() => void copyCard(example)}>
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
              </header>

              <div className="gloss-block">
                <div className="text-line native-line" aria-label={`${example.language} native text`}>
                  <span className="line-label">{example.nativeLabel}</span>
                  <span className="line-content">{example.nativeText}</span>
                </div>
                <div
                  className={`text-line gloss-line ${mode === 'mirror' ? 'gloss-line-mirror' : 'gloss-line-plain'}`}
                  aria-label={`${example.language} phonetic gloss`}
                >
                  <span className="line-label">{example.phoneticLabel}</span>
                  <span className="line-content">{example.phoneticText}</span>
                </div>
                <div
                  className={`text-line gloss-line ${mode === 'mirror' ? 'gloss-line-mirror' : 'gloss-line-plain'}`}
                  aria-label={`${example.language} meaning gloss`}
                >
                  <span className="line-label">{example.meaningLabel}</span>
                  <span className="line-content">{example.meaningText}</span>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default App;
