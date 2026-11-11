const milestones = [
  { date: "٢٨ أغسطس ٢٠٢٦", title: "أول مرة", description: "اليوم اللي اتقابلنا فيه، وابتدت حكايتنا." },
  { date: "١٠ سبتمبر ٢٠٢٦", title: "قراية الفاتحة", description: "خطوة جميلة قربتنا من حلمنا سوا." },
  { date: "٩ أكتوبر ٢٠٢٦", title: "خطوبتنا", description: "يوم بقى فيه لحكايتنا وعد جديد." },
] as const;

export function OurStoryTimeline() {
  return (
    <section id="our-story" className="memory-section story-section" aria-labelledby="story-title" dir="rtl">
      <div className="memory-container">
        <header className="story-heading" data-reveal>
          <p className="memory-eyebrow">من أول لقاء ولسه الحكاية مكملة</p>
          <h2 id="story-title">قصة حياتنا سوا</h2>
          <p>كل تاريخ في حكايتنا كان بداية لحاجة أحلى.</p>
        </header>
        <ol className="story-timeline">
          {milestones.map((milestone) => (
            <li className="story-milestone" key={milestone.date} data-reveal>
              <span className="story-dot" aria-hidden="true" />
              <div className="story-card">
                <time>{milestone.date}</time>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </div>
            </li>
          ))}
          <li className="story-milestone story-future" data-reveal>
            <span className="story-dot story-dot-final" aria-hidden="true">♥</span>
            <div className="story-card">
              <h3>وتكتمل الحياة…</h3>
              <p>بإذن الله، نكمل باقي العمر سوا.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
