import Navbar from "../components/Navbar"

const steps = [
  { n: "01", title: "Open the platform",       desc: "Navigate to the AfyaAI homepage. You'll be greeted by the 3D health avatar." },
  { n: "02", title: "Create an account",        desc: "Sign up with your email or continue as a guest to explore basic features." },
  { n: "03", title: "Complete your check-in",   desc: "Log your sleep, hydration, mood, and any symptoms for the day." },
  { n: "04", title: "Chat with AfyaAI",         desc: "Type or speak your health questions. The AI provides calm, non-diagnostic guidance." },
  { n: "05", title: "View your stats",          desc: "Check your daily and weekly wellness overview in the left panel." },
  { n: "06", title: "Find nearby facilities",   desc: "Use the Facilities page to locate clinics and hospitals near you." },
]

// Set to true and replace VIDEO_ID when you have the tutorial ready
const VIDEO_READY = false
const YOUTUBE_VIDEO_ID = "VIDEO_ID_HERE"

export default function UserGuide() {
  return (
    <div style={pageStyle}>
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

        .guide-page * { box-sizing: border-box; }

        .guide-hero {
          text-align: center;
          padding: 56px 24px 40px;
          max-width: 640px;
          margin: 0 auto;
        }

        .guide-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #d8f3dc;
          color: #1a4731;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 99px;
          margin-bottom: 18px;
          letter-spacing: 0.4px;
        }

        .guide-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.4rem;
          color: #1a4731;
          margin: 0 0 14px;
        }

        .guide-subtitle {
          font-size: 0.95rem;
          color: #3a5c46;
          line-height: 1.7;
        }

        .guide-body {
          max-width: 820px;
          margin: 0 auto 60px;
          padding: 0 24px;
        }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: #52b788;
          margin-bottom: 14px;
        }

        .section-heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          color: #1a4731;
          margin: 0 0 24px;
        }

        .video-section {
          margin-bottom: 52px;
        }

        .video-wrapper {
          background: #fff;
          border: 1px solid #d8f3dc;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(26,71,49,0.08);
          aspect-ratio: 16/9;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-wrapper iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        .video-coming-soon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 40px;
          text-align: center;
        }

        .video-coming-soon-icon {
          font-size: 3rem;
        }

        .video-coming-soon-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          color: #1a4731;
          margin: 0;
        }

        .video-coming-soon-sub {
          font-size: 0.88rem;
          color: #7a9e87;
          margin: 0;
        }

        .steps-section {
          margin-bottom: 52px;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .step-card {
          background: #fff;
          border: 1px solid #d8f3dc;
          border-radius: 14px;
          padding: 20px 22px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
          box-shadow: 0 2px 8px rgba(26,71,49,0.05);
          transition: transform 0.18s, box-shadow 0.18s;
        }

        .step-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(26,71,49,0.09);
        }

        .step-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #d8f3dc;
          line-height: 1;
          flex-shrink: 0;
          min-width: 36px;
        }

        .step-content {}

        .step-title {
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          color: #1a4731;
          margin: 0 0 4px;
        }

        .step-desc {
          font-size: 0.87rem;
          color: #3a5c46;
          line-height: 1.6;
          margin: 0;
        }

        .help-card {
          background: linear-gradient(135deg, #1a4731, #2d6a4f);
          border-radius: 18px;
          padding: 32px;
          text-align: center;
          color: #fff;
        }

        .help-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          color: #fff;
          margin: 0 0 10px;
        }

        .help-card p {
          font-size: 0.9rem;
          color: #a8d5bb;
          margin: 0 0 20px;
          line-height: 1.65;
        }

        .help-btn {
          display: inline-block;
          background: #52b788;
          color: #fff;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 10px 24px;
          border-radius: 99px;
          text-decoration: none;
          transition: background 0.2s;
        }

        .help-btn:hover {
          background: #74c69d;
          color: #fff;
        }
      `}</style>

      <div className="guide-page">
        <div className="guide-hero">
          <div className="guide-badge">📖 Getting Started</div>
          <h1 className="guide-title">User Guide</h1>
          <p className="guide-subtitle">
            Everything you need to get the most out of AfyaAI — from your first check-in
            to finding nearby medical facilities.
          </p>
        </div>

        <div className="guide-body">
          {/* Video section */}
          <div className="video-section">
            <div className="section-label">Tutorial</div>
            <h2 className="section-heading">Watch the walkthrough</h2>
            <div className="video-wrapper">
              {VIDEO_READY ? (
                <iframe
                  src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
                  title="AfyaAI Tutorial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="video-coming-soon">
                  <span className="video-coming-soon-icon">🎬</span>
                  <h3 className="video-coming-soon-title">Tutorial coming soon</h3>
                  <p className="video-coming-soon-sub">We're putting the finishing touches on our walkthrough video. Check back shortly!</p>
                </div>
              )}
            </div>
          </div>

          {/* Steps */}
          <div className="steps-section">
            <div className="section-label">Step by Step</div>
            <h2 className="section-heading">How to use AfyaAI</h2>
            <div className="steps-list">
              {steps.map(step => (
                <div className="step-card" key={step.n}>
                  <span className="step-num">{step.n}</span>
                  <div className="step-content">
                    <p className="step-title">{step.title}</p>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help CTA */}
          <div className="help-card">
            <h3>Still need help?</h3>
            <p>If you have questions that aren't answered here, reach out to the team via GitHub or through our support page.</p>
            <a href="https://github.com/elviscgn/AfyaAI" target="_blank" rel="noopener noreferrer" className="help-btn">
              Contact Support →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

const pageStyle = {
  paddingTop: "60px",
  minHeight: "100vh",
  background: "#f7fdf9",
  fontFamily: "'DM Sans', sans-serif",
}
