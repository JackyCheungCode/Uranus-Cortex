import { ArrowRight, CheckmarkFilled, Code } from '@carbon/icons-react';
import { Button, Column, Grid, Stack, Tag, Tile } from '@carbon/react';

const foundationChecks = [
  'Carbon-first component policy documented',
  'TypeScript and lint quality gates configured',
  'Automated component test baseline added',
];

export default function App() {
  return (
    <main className="app-shell" aria-label="Uranus Cortex application">
      <header className="app-header">
        <div className="app-header__brand">
          <Code size={24} aria-hidden="true" />
          <span>URANUS CORTEX</span>
        </div>
        <Tag type="blue">Foundation preview</Tag>
      </header>
      <Grid className="app-content">
        <Column sm={4} md={8} lg={12} xlg={12}>
          <Stack gap={7}>
            <section className="hero" aria-labelledby="page-title">
              <p className="eyebrow">PROJECT FOUNDATION</p>
              <h1 id="page-title">Uranus Cortex</h1>
              <p className="hero__summary">
                A Carbon-first application foundation, with accessibility and engineering quality built into the workflow.
              </p>
              <div className="hero__actions">
                <Button renderIcon={ArrowRight} onClick={() => document.getElementById('foundation')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore foundation
                </Button>
              </div>
            </section>
            <section id="foundation" aria-labelledby="foundation-title">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">GOVERNANCE</p>
                  <h2 id="foundation-title">Foundation status</h2>
                </div>
                <Tag type="green">In progress</Tag>
              </div>
              <Grid>
                {foundationChecks.map((check) => (
                  <Column key={check} sm={4} md={4} lg={4}>
                    <Tile className="status-tile">
                      <CheckmarkFilled size={20} className="status-tile__icon" aria-hidden="true" />
                      <p>{check}</p>
                    </Tile>
                  </Column>
                ))}
              </Grid>
            </section>
            <section className="next-steps" aria-labelledby="next-steps-title">
              <h2 id="next-steps-title">Built to be reviewed</h2>
              <p>
                This preview is a technical foundation, not a completed product.
                Product workflows, data persistence, and deployment will be defined from agreed requirements.
              </p>
            </section>
          </Stack>
        </Column>
      </Grid>
    </main>
  );
}
