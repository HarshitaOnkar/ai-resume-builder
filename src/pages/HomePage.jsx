import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-headline">Build a Resume That Gets Read.</h1>
        <p className="home-sub">Create a clear, ATS-friendly resume with premium typography and structure.</p>
        <Link to="/builder" className="home-cta">
          Start Building
        </Link>
      </div>
    </div>
  );
}
