import { useState, type CSSProperties } from 'react';

type GlossMode = 'mirror' | 'plain';
type LayoutMode =
  | 'hebrew-first'
  | 'pronunciation-first'
  | 'english-first'
  | 'separate-blocks';

type Example = {
  nativeText: string;
  phoneticText: string;
  meaningText: string;
  segments: Array<{
    hebrew: string;
    transliteration: string;
    meaning: string;
  }>;
};

type SpecimenRow = {
  label: string;
  text: string;
};

const MIRROR_FONT_STACK = '"RTL Latin", "RTLLatin", system-ui, sans-serif';

const EXAMPLE: Example = {
  nativeText:
    'בָּרוּךְ אַתָּה יְיָ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ לְהַדְלִיק נֵר שֶׁל שַׁבָּת',
  phoneticText:
    'barukh atah adonai eloheinu melekh ha-olam asher kiddeshanu be-mitzvotav ve-tzivanu lehadlik ner shel shabbat',
  meaningText:
    'blessed are You, Lord our God, King of the universe, who sanctified us with His commandments and commanded us to light the Shabbat candle',
  segments: [
    { hebrew: 'בָּרוּךְ אַתָּה יְיָ', transliteration: 'barukh atah adonai', meaning: 'Blessed are You, Lord' },
    { hebrew: 'אֱלֹהֵינוּ', transliteration: 'eloheinu', meaning: 'our God' },
    { hebrew: 'מֶלֶךְ הָעוֹלָם', transliteration: 'melekh ha-olam', meaning: 'King of the universe' },
    { hebrew: 'אֲשֶׁר קִדְּשָׁנוּ', transliteration: 'asher kiddeshanu', meaning: 'who sanctified us' },
    { hebrew: 'בְּמִצְוֹתָיו', transliteration: 'be-mitzvotav', meaning: 'with His commandments' },
    { hebrew: 'וְצִוָּנוּ', transliteration: 've-tzivanu', meaning: 'and commanded us' },
    { hebrew: 'לְהַדְלִיק נֵר', transliteration: 'lehadlik ner', meaning: 'to light the candle' },
    { hebrew: 'שֶׁל שַׁבָּת', transliteration: 'shel shabbat', meaning: 'of Shabbat' },
  ],
};

const SPECIMEN_ROWS: SpecimenRow[] = [
  { label: 'Uppercase', text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  { label: 'Lowercase', text: 'abcdefghijklmnopqrstuvwxyz' },
  { label: 'Numerals', text: '0123456789' },
  { label: 'Punctuation', text: '.,;:!?()[]{}<>/\\@#%&+-=' },
];

function App() {
  const [mode, setMode] = useState<GlossMode>('mirror');
  const [layout, setLayout] = useState<LayoutMode>('hebrew-first');
  const [copied, setCopied] = useState(false);

  const copyCard = async () => {
    const block = [
      EXAMPLE.nativeText,
      EXAMPLE.phoneticText,
      EXAMPLE.meaningText,
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

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const renderPhraseSegment = (
    hebrew: string,
    transliteration: string,
    meaning: string,
    key: string,
  ) => {
    let rows = [
      <span key="hebrew" className="segment-hebrew">
        {hebrew}
      </span>,
      <span
        key="transliteration"
        className={`segment-gloss ${mode === 'mirror' ? 'segment-gloss-mirror' : 'segment-gloss-plain'}`}
      >
        {transliteration}
      </span>,
      <span
        key="meaning"
        className={`segment-gloss segment-meaning ${mode === 'mirror' ? 'segment-gloss-mirror' : 'segment-gloss-plain'}`}
      >
        {meaning}
      </span>,
    ];

    if (layout === 'hebrew-first') {
      rows = [rows[0], rows[1], rows[2]];
    }

    if (layout === 'pronunciation-first') {
      rows = [rows[1], rows[0], rows[2]];
    }

    if (layout === 'english-first') {
      rows = [rows[2], rows[0], rows[1]];
    }

    return (
      <article key={key} className="interlinear-segment">
        {rows}
      </article>
    );
  };

  return (
    <main
      className="app-shell"
      style={
        {
          '--gloss-font-size': '30px',
          '--mirror-font-family': MIRROR_FONT_STACK,
        } as CSSProperties
      }
    >
      <section className="hero">
        <p className="eyebrow">Reading Path Experiment</p>
        <h1>Keep Hebrew, transliteration, and translation on one eye track</h1>
        <p className="intro">
          Standard Hebrew learning layouts often split the line into separate
          zones: Hebrew on the right, transliteration on the left, then English
          underneath. The idea behind RTL Latin is that if the Latin gloss lines
          also flow right-to-left, the reader can follow all three layers with
          the same eye movement instead of bouncing across the page.
        </p>
        <div className="hero-actions">
          <a className="download-link" href="/fonts/RTLLatin-Regular.otf" download>
            Download OTF
          </a>
          <a className="download-link download-link-secondary" href="/fonts/RTLLatin-Regular.woff2" download>
            Download WOFF2
          </a>
          <a className="download-link download-link-secondary" href="/OFL.txt" download>
            Download OFL
          </a>
        </div>
      </section>

      <section className="hypothesis-panel">
        <div className="hypothesis-card">
          <p className="card-kicker">Problem</p>
          <h2>Conventional glossing scatters related information</h2>
          <p>
            Hebrew, transliteration, and English meaning all belong to the same
            phrase, but a learner often has to scan left, then right, then down
            to connect them.
          </p>
        </div>
        <div className="hypothesis-card">
          <p className="card-kicker">Hypothesis</p>
          <h2>Mirrored Latin can reduce that visual jumping</h2>
          <p>
            If the gloss lines share the same RTL edge and reading direction as
            the Hebrew, the phrase may be easier to track, rehearse, and retain.
          </p>
        </div>
      </section>

      <section className="comparison-grid" aria-label="Conventional versus aligned gloss comparison">
        <article className="comparison-card comparison-card-problem">
          <header className="comparison-header">
            <div>
              <p className="card-kicker">Before</p>
              <h2>Conventional layout</h2>
            </div>
            <p className="path-chip">Eye path: left to right, then down</p>
          </header>

          <div className="conventional-frame">
            <div className="conventional-topline">
              <div className="conventional-cell conventional-cell-left">
                <span className="line-label">Transliteration</span>
                <span className="conventional-ltr">{EXAMPLE.phoneticText}</span>
              </div>
              <div className="conventional-cell conventional-cell-right">
                <span className="line-label">Hebrew</span>
                <span className="conventional-hebrew">{EXAMPLE.nativeText}</span>
              </div>
            </div>
            <div className="conventional-bottomline">
              <span className="line-label">English translation</span>
              <span className="conventional-ltr">{EXAMPLE.meaningText}</span>
            </div>
          </div>

          <ul className="note-list compact-list">
            <li>The transliteration begins from the opposite side of the phrase.</li>
            <li>The translation sits on a separate track below the line.</li>
            <li>The learner must keep remapping where the related parts live.</li>
          </ul>
        </article>

        <article className="comparison-card comparison-card-solution">
          <header className="comparison-header">
            <div>
              <p className="card-kicker">After</p>
              <h2>Aligned reading flow</h2>
            </div>
          </header>

          <div className="gloss-block">
            <div className="interlinear-frame">
              <div className="interlinear-grid" aria-label="Aligned interlinear gloss">
                {layout === 'separate-blocks' ? (
                  <div className="line-stack" aria-label="Separate stacked lines">
                    <div className="line-stack-row">
                      <span className="line-label">Hebrew</span>
                      <span className="line-stack-hebrew">{EXAMPLE.nativeText}</span>
                    </div>
                    <div className="line-stack-row">
                      <span className="line-label">Transliteration</span>
                      <span
                        className={`line-stack-gloss ${mode === 'mirror' ? 'line-stack-gloss-mirror' : 'line-stack-gloss-plain'}`}
                      >
                        {EXAMPLE.phoneticText}
                      </span>
                    </div>
                    <div className="line-stack-row">
                      <span className="line-label">English translation</span>
                      <span
                        className={`line-stack-gloss line-stack-meaning ${mode === 'mirror' ? 'line-stack-gloss-mirror' : 'line-stack-gloss-plain'}`}
                      >
                        {EXAMPLE.meaningText}
                      </span>
                    </div>
                  </div>
                ) : (
                  EXAMPLE.segments.map((segment) =>
                    renderPhraseSegment(
                      segment.hebrew,
                      segment.transliteration,
                      segment.meaning,
                      `${segment.hebrew}-${segment.transliteration}`,
                    ),
                  )
                )}
              </div>
            </div>
            <section className="control-panel" aria-label="Demo controls">
              <p className="control-kicker">Gloss direction</p>
              <div className="mode-toggle" role="group" aria-label="Gloss display mode">
                <button
                  type="button"
                  className={mode === 'mirror' ? 'is-active' : ''}
                  onClick={() => setMode('mirror')}
                >
                  Mirrored RTL
                </button>
                <button
                  type="button"
                  className={mode === 'plain' ? 'is-active' : ''}
                  onClick={() => setMode('plain')}
                >
                  Standard Latin
                </button>
              </div>
            </section>
            <section className="control-panel control-panel-layout" aria-label="Layout controls">
              <p className="control-kicker">Layout</p>
              <div className="mode-toggle" role="group" aria-label="Layout mode">
                <button
                  type="button"
                  className={layout === 'hebrew-first' ? 'is-active' : ''}
                  onClick={() => setLayout('hebrew-first')}
                >
                  Hebrew First
                </button>
                <button
                  type="button"
                  className={layout === 'pronunciation-first' ? 'is-active' : ''}
                  onClick={() => setLayout('pronunciation-first')}
                >
                  Pronunciation First
                </button>
                <button
                  type="button"
                  className={layout === 'english-first' ? 'is-active' : ''}
                  onClick={() => setLayout('english-first')}
                >
                  English First
                </button>
                <button
                  type="button"
                  className={layout === 'separate-blocks' ? 'is-active' : ''}
                  onClick={() => setLayout('separate-blocks')}
                >
                  Separate Blocks
                </button>
              </div>
            </section>
            <div className="gloss-actions">
              <button type="button" className="copy-button copy-button-subtle" onClick={() => void copyCard()}>
                {copied ? 'Copied' : 'Copy block'}
              </button>
            </div>
          </div>

          <p className="after-note">
            Compare whether phrase-bound stacks or separate Hebrew-first blocks best preserve a clear right-anchored reading path.
          </p>
        </article>
      </section>

      <section className="info-grid" aria-label="Font metadata and install notes">
        <article className="info-card">
          <p className="card-kicker">Metadata</p>
          <h2>Font details</h2>
          <dl className="meta-list">
            <div>
              <dt>Family</dt>
              <dd>RTL Latin</dd>
            </div>
            <div>
              <dt>Style</dt>
              <dd>Regular</dd>
            </div>
            <div>
              <dt>PostScript</dt>
              <dd>RTLLatin-Regular</dd>
            </div>
            <div>
              <dt>Designer</dt>
              <dd>Rasmus Andersson</dd>
            </div>
            <div>
              <dt>Manufacturer</dt>
              <dd>rsms</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>SIL Open Font License 1.1</dd>
            </div>
          </dl>
        </article>

        <article className="info-card">
          <p className="card-kicker">Use case</p>
          <h2>Built for Hebrew learning experiments</h2>
          <ul className="note-list">
            <li>Desktop use: install the OTF in your system font library.</li>
            <li>Web use: load the WOFF2 with `@font-face`.</li>
            <li>Redistribution: include `OFL.txt` with the font package.</li>
          </ul>
          <p className="license-note">
            This project is aimed at Biblical and liturgical Hebrew study, where
            reading-path continuity may matter as much as raw legibility.
          </p>
        </article>
      </section>

      <section className="specimen-panel" aria-label="RTL Latin specimen">
        <div className="specimen-heading">
          <div>
            <p className="card-kicker">Specimen</p>
            <h2>Character set preview</h2>
          </div>
          <p className="specimen-copy">
            These runs use the actual bundled font so visitors can inspect the
            mirrored Latin forms before downloading.
          </p>
        </div>

        <div className="specimen-grid">
          {SPECIMEN_ROWS.map((row) => (
            <article key={row.label} className="specimen-card">
              <p className="line-label">{row.label}</p>
              <p className="specimen-line specimen-line-mirror">{row.text}</p>
              <p className="specimen-line specimen-line-plain">{row.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
