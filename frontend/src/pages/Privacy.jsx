import Icon from "../icons/Icon";

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect information you voluntarily provide: wellness check-in data (sleep, mood, hydration), chat messages, and basic account details such as name and email. We may also collect anonymised usage data to improve the service.",
  },
  {
    title: "How We Use Your Information",
    body: "Your information personalises your wellness experience, generates relevant AI responses, and delivers daily check-in summaries. Chat content is processed solely to produce helpful replies.",
    highlight:
      "Your real name is never transmitted to the AI model. All messages are fully anonymised before reaching the language model — your identity stays private at every step.",
  },
  {
    title: "Data Sharing & Third Parties",
    body: "We do not sell personal data. We may share anonymised, aggregated insights with research partners. Our AI is powered by Meta Llama via encrypted API calls; no personally identifiable information is ever included in those requests.",
  },
  {
    title: "Data Storage & Security",
    body: "All data is stored on encrypted servers using AES-256 at rest and TLS 1.3 in transit. We conduct regular security audits and strictly limit access to authorised personnel only.",
  },
  {
    title: "Retention of Data",
    body: "We retain your data for as long as your account is active or as needed to deliver the service. You may request complete deletion at any time. Anonymised aggregate data may be retained for research purposes.",
  },
  {
    title: "Your Rights",
    body: "You have the right to access, correct, export, or delete your personal data. You may opt out of optional data collection via Settings. To exercise these rights, contact us at privacy@afyaai.health.",
  },
  {
    title: "Children's Privacy",
    body: "AfyaAI is not intended for users under 13. We do not knowingly collect information from minors. If we discover this has occurred, we will delete the data immediately.",
  },
  {
    title: "Updates to This Policy",
    body: "We may update this policy periodically. Significant changes will be communicated via in-app notification or email. Continued use of AfyaAI after changes are posted constitutes acceptance of the revised policy.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="afya-inner afya-fi">
      <div className="afya-wrap">
        <div className="afya-phero">
          <p className="afya-eyebrow" style={{ marginBottom: 13 }}>Legal</p>
          <h1 className="afya-ph1">Privacy Policy</h1>
          <p style={{ fontSize: 11.5, color: "var(--a-cream3)", marginBottom: 14 }}>
            Effective January 1, 2025 &nbsp;·&nbsp; Last updated March 2025
          </p>
          <p className="afya-plead">
            Your privacy matters. A plain-language explanation of how AfyaAI collects, uses, and protects your information.
          </p>
        </div>

        <div className="afya-plist">
          {SECTIONS.map((s, i) => (
            <div className="afya-pcard" key={s.title}>
              <div className="afya-phead">
                <div className="afya-pnum">{i + 1}</div>
                <div className="afya-ptitle">{s.title}</div>
              </div>
              <div className="afya-pbody">
                {s.body}
                {s.highlight && (
                  <div className="afya-phighlight">
                    <Icon n="lock" size={13} stroke="var(--a-greenbr)" />
                    <span>{s.highlight}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
