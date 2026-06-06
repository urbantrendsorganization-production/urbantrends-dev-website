import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developers",
  description: "Build on the same M-Pesa and Daraja primitives our products run on. Free and documented.",
};

export default function DocsPage() {
  return (
    <>
      <section className="page-head" data-screen-label="Developers" style={{ paddingBottom: 8 }}>
        <div className="wrap">
          <div className="breadcrumb"><Link href="/">Home</Link><span className="sep">/</span><span>Developers</span></div>
          <h1 className="page-title" style={{ fontSize: "clamp(30px,4vw,46px)" }}>Build on the <span className="em">reconciliation core.</span></h1>
          <p className="page-lead">The same M-Pesa and Daraja primitives our products run on, documented and free to use. Dark by default, because of course.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap docs-layout">
          <aside className="docs-side">
            <h6>Get started</h6>
            <a className="active" href="#introduction">Introduction</a>
            <a href="#quickstart">Quickstart</a>
            <a href="#auth">Authentication</a>
            <h6>Daraja</h6>
            <a href="#stk">STK Push</a>
            <a href="#callback">Callbacks</a>
            <a href="#reconcile">Reconcile</a>
            <h6>Tools</h6>
            <a href="#tools">Daraja Playground</a>
            <a href="#tools">Scaffold CLI</a>
            <a href="#tools">OG Studio</a>
            <h6>Reference</h6>
            <a href="#api">API reference</a>
            <a href="#webhooks">Webhooks</a>
            <a href="#errors">Errors</a>
          </aside>

          <div className="docs-content">
            <h2 id="introduction">Introduction</h2>
            <p>The UrbanTrends SDK wraps Safaricom&apos;s Daraja API with sane defaults, typed responses, and the reconciliation logic we use in production. Install it, point it at your Paybill, and stop hand-rolling callback parsers.</p>
            <div className="callout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
              <div>You&apos;ll need Daraja sandbox credentials. Grab them from the <span className="inline-code">Daraja Playground</span> — no Safaricom portal spelunking required.</div>
            </div>

            <h3 id="quickstart">Quickstart</h3>
            <p>Install the SDK and scaffold a Daraja-wired backend in one command.</p>
            <div className="code-window">
              <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">terminal</span><span className="lang">bash</span></div>
              <pre className="code"><span className="p">$</span> npm i <span className="s">@urbantrends/mpesa</span>{"\n"}<span className="p">$</span> npx <span className="s">@urbantrends/scaffold</span> my-app{"\n"}<span className="c">{"# → typed routes, reconciliation jobs, .env template"}</span></pre>
            </div>

            <h3 id="auth">Authentication</h3>
            <p>Initialise the client with your consumer key and secret. Tokens are fetched and refreshed for you.</p>
            <div className="endpoint"><span className="verb">GET</span><span className="path">/oauth/v1/generate</span><button className="copy-btn" type="button">Copy</button></div>
            <div className="code-window">
              <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">client.ts</span><span className="lang">TypeScript</span></div>
              <pre className="code"><span className="k">import</span> {"{ Daraja }"} <span className="k">from</span> <span className="s">{`"@urbantrends/mpesa"`}</span>;{"\n"}{"\n"}<span className="k">const</span> <span className="v">daraja</span> = <span className="k">new</span> <span className="f">Daraja</span>{"({"}{"\n"}{"  "}key: process.env.<span className="v">DARAJA_KEY</span>,{"\n"}{"  "}secret: process.env.<span className="v">DARAJA_SECRET</span>,{"\n"}{"  "}env: <span className="s">{`"sandbox"`}</span>,{"\n"}{"});"}</pre>
            </div>

            <h3 id="stk">Trigger an STK Push</h3>
            <p>Prompt a customer to authorise a payment from their phone. The promise resolves with a <span className="inline-code">CheckoutRequestID</span> you can track to settlement.</p>
            <div className="endpoint"><span className="verb post">POST</span><span className="path">/mpesa/stkpush/v1/processrequest</span><button className="copy-btn" type="button">Copy</button></div>
            <div className="code-window">
              <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">checkout.ts</span><span className="lang">TypeScript</span></div>
              <pre className="code"><span className="k">const</span> <span className="v">res</span> = <span className="k">await</span> <span className="f">daraja</span>.<span className="f">stkPush</span>{"({"}{"\n"}{"  "}phone: <span className="s">{`"2547XXXXXXXX"`}</span>,{"\n"}{"  "}amount: <span className="n">45000</span>,{"\n"}{"  "}account: <span className="s">{`"UNIT-4B"`}</span>,{"\n"}{"  "}callback: <span className="s">{`"https://api.example.ke/cb"`}</span>,{"\n"}{"});"}{"\n"}<span className="c">{"// res.CheckoutRequestID → track to settlement"}</span></pre>
            </div>

            <h3 id="callback">Handle the callback</h3>
            <p>Daraja posts the result to your callback URL. Parse it once, trust it always — the SDK verifies and normalises the payload.</p>
            <div className="code-window">
              <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">callback.ts</span><span className="lang">TypeScript</span></div>
              <pre className="code"><span className="f">app</span>.<span className="f">post</span>(<span className="s">{`"/cb"`}</span>, <span className="k">async</span> {"(req, res) =>"} {"{"}{"\n"}{"  "}<span className="k">const</span> tx = <span className="f">daraja</span>.<span className="f">parseCallback</span>{"(req.body);"}{"\n"}{"  "}<span className="k">if</span> {"(tx.ok)"} <span className="k">await</span> <span className="f">ledger</span>.<span className="f">apply</span>{"(tx);"}{"\n"}{"  "}res.<span className="f">json</span>{"({ ResultCode: "}<span className="n">0</span>{" });"}{"\n"}{"});"}</pre>
            </div>

            <h3 id="reconcile">Reconcile</h3>
            <p>Match settled transactions to your own records. Idempotent by design — replaying a callback never double-applies.</p>
            <div className="code-window">
              <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">reconcile.ts</span><span className="lang">TypeScript</span></div>
              <pre className="code"><span className="k">await</span> <span className="f">daraja</span>.<span className="f">reconcile</span>{"(tx, {"}{"\n"}{"  "}against: <span className="s">{`"invoices"`}</span>,{"\n"}{"  "}idempotencyKey: tx.receipt,{"\n"}{"  "}tolerance: <span className="n">0</span>,{"\n"}{"});"}{"\n"}<span className="p">{"→ matched · 38ms · safe to retry"}</span></pre>
            </div>

            <div className="callout" style={{ marginTop: 34 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>
              <div>Ready to try it live? Open the <Link href="/docs#tools" style={{ color: "var(--accent-text)", textDecoration: "underline" }}>Daraja Playground</Link> and fire your first STK Push in under a minute.</div>
            </div>

            <h2 id="tools">Tools</h2>
            <p>All tools are free, open-source, and require no account. They&apos;re utilities we built for ourselves and polished enough to share.</p>

            <h3>Daraja Playground</h3>
            <p>A browser-based sandbox for firing STK Pushes, inspecting callbacks, and replaying webhook payloads — no Postman setup needed. Point it at your sandbox or production shortcode.</p>
            <div className="code-window">
              <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">terminal</span><span className="lang">bash</span></div>
              <pre className="code"><span className="c">{"# Open in browser"}</span>{"\n"}<span className="p">$</span> open daraja.urbantrends.dev</pre>
            </div>

            <h3>Scaffold CLI</h3>
            <p>Generate a fully wired Daraja backend — typed routes, reconciliation jobs, callback handler, and <span className="inline-code">.env</span> template — in a single command.</p>
            <div className="code-window">
              <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">terminal</span><span className="lang">bash</span></div>
              <pre className="code"><span className="p">$</span> npx <span className="s">@urbantrends/scaffold</span> my-app{"\n"}{"\n"}<span className="c">{"# → my-app/"}</span>{"\n"}<span className="c">{"#   src/daraja/client.ts"}</span>{"\n"}<span className="c">{"#   src/daraja/callback.ts"}</span>{"\n"}<span className="c">{"#   src/reconcile/index.ts"}</span>{"\n"}<span className="c">{"#   .env.example"}</span></pre>
            </div>

            <h3>OG Studio</h3>
            <p>Programmatic Open Graph cards from a URL. Pass a template name and query params; get a 1200×630 PNG. Useful for blog posts, docs pages, and dynamic product cards.</p>
            <div className="code-window">
              <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">usage</span><span className="lang">URL</span></div>
              <pre className="code"><span className="s">https://og.urbantrends.dev/new</span>{"\n"}  ?title=RentFlow+Quickstart{"\n"}  &amp;tag=Engineering{"\n"}  &amp;accent=%2322D3EE</pre>
            </div>

            <h2 id="webhooks">Webhooks</h2>
            <p>UrbanTrends products emit webhooks for key lifecycle events. All webhook payloads are signed with HMAC-SHA256 using your account&apos;s webhook secret.</p>

            <h3>Verify a webhook signature</h3>
            <div className="code-window">
              <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">verify.ts</span><span className="lang">TypeScript</span></div>
              <pre className="code"><span className="k">import</span> {"{ createHmac }"} <span className="k">from</span> <span className="s">{`"crypto"`}</span>;{"\n"}{"\n"}<span className="k">function</span> <span className="f">verifyWebhook</span>{"(payload: string, sig: string, secret: string)"} {"{"}{"\n"}{"  "}<span className="k">const</span> expected = <span className="f">createHmac</span>(<span className="s">{`"sha256"`}</span>, secret){"\n"}{"    "}.<span className="f">update</span>(payload).<span className="f">digest</span>(<span className="s">{`"hex"`}</span>);{"\n"}{"  "}<span className="k">return</span> <span className="f">timingSafeEqual</span>({"\n"}{"    "}Buffer.<span className="f">from</span>(sig), Buffer.<span className="f">from</span>(expected){"\n"}{"  "});{"\n"}{"}"}</pre>
            </div>

            <h3>Webhook events</h3>
            <div className="compare" style={{ marginTop: 20 }}>
              <table>
                <thead><tr><th>Event</th><th>Trigger</th><th>Products</th></tr></thead>
                <tbody>
                  <tr><td className="inline-code">payment.matched</td><td>Transaction reconciled to an invoice</td><td>RentFlow</td></tr>
                  <tr><td className="inline-code">payment.orphaned</td><td>Payment received with no matching invoice</td><td>RentFlow</td></tr>
                  <tr><td className="inline-code">stk.success</td><td>STK Push completed and settled</td><td>All</td></tr>
                  <tr><td className="inline-code">stk.failed</td><td>STK Push cancelled or timed out</td><td>All</td></tr>
                  <tr><td className="inline-code">lead.scored</td><td>New lead enriched and scored</td><td>TrendyyLeads</td></tr>
                  <tr><td className="inline-code">application.submitted</td><td>Candidate applied to a shortlist</td><td>PortfolioU</td></tr>
                </tbody>
              </table>
            </div>

            <h2 id="api">API Reference</h2>
            <p>All API endpoints are REST over HTTPS. Responses are JSON. Authentication uses Bearer tokens obtained via the OAuth endpoint above.</p>

            <h3>Base URL</h3>
            <div className="code-window">
              <div className="code-bar"><div className="tl"><i></i><i></i><i></i></div><span className="fname">base</span><span className="lang">URL</span></div>
              <pre className="code"><span className="s">https://api.urbantrends.dev/v1</span></pre>
            </div>

            <h3>Core endpoints</h3>
            <div className="endpoint"><span className="verb">GET</span><span className="path">/transactions</span><button className="copy-btn" type="button">Copy</button></div>
            <p>List reconciled transactions. Supports <span className="inline-code">since</span>, <span className="inline-code">until</span>, <span className="inline-code">status</span> query params.</p>

            <div className="endpoint"><span className="verb post">POST</span><span className="path">/transactions/reconcile</span><button className="copy-btn" type="button">Copy</button></div>
            <p>Manually trigger reconciliation for a transaction by its M-Pesa receipt number. Idempotent.</p>

            <div className="endpoint"><span className="verb">GET</span><span className="path">/invoices</span><button className="copy-btn" type="button">Copy</button></div>
            <p>List invoices. Filter by <span className="inline-code">status</span> (<span className="inline-code">paid</span>, <span className="inline-code">unpaid</span>, <span className="inline-code">partial</span>), <span className="inline-code">tenant_id</span>, or <span className="inline-code">unit_id</span>.</p>

            <div className="endpoint"><span className="verb post">POST</span><span className="path">/stk/push</span><button className="copy-btn" type="button">Copy</button></div>
            <p>Trigger an STK Push. Returns a <span className="inline-code">CheckoutRequestID</span> for tracking.</p>

            <div className="endpoint"><span className="verb">GET</span><span className="path">/webhooks</span><button className="copy-btn" type="button">Copy</button></div>
            <p>List registered webhook endpoints for your account.</p>

            <div className="endpoint"><span className="verb post">POST</span><span className="path">/webhooks</span><button className="copy-btn" type="button">Copy</button></div>
            <p>Register a new webhook endpoint. Accepts <span className="inline-code">url</span>, <span className="inline-code">events[]</span>, and <span className="inline-code">secret</span>.</p>

            <h2 id="errors">Errors</h2>
            <p>The API uses conventional HTTP status codes. Errors return a JSON body with a <span className="inline-code">code</span> and <span className="inline-code">message</span> field.</p>

            <div className="compare" style={{ marginTop: 20 }}>
              <table>
                <thead><tr><th>Code</th><th>HTTP</th><th>Meaning</th></tr></thead>
                <tbody>
                  <tr><td className="inline-code">UNAUTHENTICATED</td><td>401</td><td>Missing or invalid Bearer token</td></tr>
                  <tr><td className="inline-code">FORBIDDEN</td><td>403</td><td>Token valid but lacks permission for this resource</td></tr>
                  <tr><td className="inline-code">NOT_FOUND</td><td>404</td><td>Resource does not exist or is not visible to your account</td></tr>
                  <tr><td className="inline-code">RATE_LIMITED</td><td>429</td><td>Too many requests — back off and retry after <span className="inline-code">Retry-After</span> seconds</td></tr>
                  <tr><td className="inline-code">DARAJA_ERROR</td><td>502</td><td>Safaricom Daraja returned an error — check <span className="inline-code">daraja_code</span> in response</td></tr>
                  <tr><td className="inline-code">RECONCILE_CONFLICT</td><td>409</td><td>Transaction already reconciled to a different invoice</td></tr>
                  <tr><td className="inline-code">INTERNAL</td><td>500</td><td>Unexpected server error — our team is paged automatically</td></tr>
                </tbody>
              </table>
            </div>

            <div className="callout" style={{ marginTop: 28 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
              <div>Daraja error codes (e.g. <span className="inline-code">1032</span> — request cancelled by user) are passed through verbatim in the <span className="inline-code">daraja_code</span> field. See the <a href="https://developer.safaricom.co.ke" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-text)", textDecoration: "underline" }}>Safaricom Daraja docs</a> for the full list.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
