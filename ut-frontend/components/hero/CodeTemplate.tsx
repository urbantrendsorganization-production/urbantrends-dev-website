export default function CodeTemplate() {
  return (
    <div className="art-diagram" style={{ gap: 14 }}>
      <div className="code-window" style={{ flex: 1 }}>
        <div className="code-bar">
          <div className="tl"><i /><i /><i /></div>
          <span className="fname">schema.ts</span>
          <span className="lang">TypeScript</span>
        </div>
        <pre className="code" style={{ fontSize: 12 }}>{`\
`}<span className="k">import</span>{` { z } `}<span className="k">from</span>{` `}<span className="s">&quot;zod&quot;</span>{`;

`}<span className="k">export const</span>{` `}<span className="v">UserSchema</span>{` = z.object({
  id:        z.string().cuid2(),
  email:     z.string().email(),
  role:      z.enum([`}<span className="s">&quot;admin&quot;</span>{`, `}<span className="s">&quot;member&quot;</span>{`]),
  createdAt: z.date(),
});

`}<span className="k">export type</span>{` `}<span className="v">User</span>{` = z.infer<`}<span className="k">typeof</span>{` UserSchema>;

`}<span className="c">{'// '}Same type on frontend, backend, and db.</span>{`
`}<span className="p">{"// → 0 casts · 0 any's · ships Friday"}</span></pre>
      </div>

      <div className="code-window" style={{ flex: 1 }}>
        <div className="code-bar">
          <div className="tl"><i /><i /><i /></div>
          <span className="fname">terminal</span>
          <span className="lang" style={{ color: "#34D399" }}>● live</span>
        </div>
        <pre className="code" style={{ fontSize: 12 }}>{`\
`}<span className="p">$</span>{` npm run build

`}<span className="c">✓ 312 files type-checked</span>{`
`}<span className="c">✓ 18 routes compiled</span>{`
`}<span className="c">✓ Bundle: 84kB gzipped</span>{`
`}<span className="c">✓ Edge functions deployed</span>{`

`}<span className="p">→ 0 errors · 0 warnings · 2.1s</span>{`
`}<span className="v">Ready on https://app.yourdomain.com</span>{` `}<span className="cursor">█</span></pre>
      </div>

      <style>{`
        .cursor { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0 } }
      `}</style>
    </div>
  );
}
