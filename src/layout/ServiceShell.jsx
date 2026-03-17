export default function ServiceShell({ title, subtitle, tag, children }) {
  return (
    <section className="service-shell">
      <div className="service-shell__hero">
        <div>
          <span className="service-shell__tag">{tag}</span>
          <h1 className="service-shell__title">{title}</h1>
          <p className="service-shell__subtitle">{subtitle}</p>
        </div>
        <div className="service-shell__badge">HelpNearBy Network</div>
      </div>
      <div className="service-shell__content">{children}</div>
    </section>
  );
}
