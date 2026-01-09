import { useSelector } from "react-redux";
import PopularGamesSlider from "../components/PopularGamesSlider";
import RecentlyReviewed from "../components/RecentlyReviewed";
import BestGames from "../components/BestGames";
import { isLoading, hasErrMsg } from "../features/games/gamesSlice";
import Loading from "../components/Loading";
import { Row, Container } from "reactstrap";
import ChatPage from "./ChatPage";

const HomePage = () => {

  const loading = useSelector(isLoading);
  const errMsg = useSelector(hasErrMsg);  

  if (loading) {
    return (
      <Row>
          <Loading message="WAIT!!! Cold Start Loading takes about 20 seconds..." showExtendedMessage={true} />
      </Row>
    );
  }

  if (errMsg) {
     console.log(`Error: ${errMsg}. That's okay, we'll serve you the same data locally instead.`);
  }

  return (
    <>
      <div>
        <Container>
          <Row>
          <h3 className="my-4 pb-2 px-1">Full-Stack AI-Powered Gaming Platform by Keri Carpenter</h3>
          <hr></hr>
            <p>
            A production-ready full-stack application showcasing modern cloud architecture and AI integration. 
            Features <strong>real-time AI chat</strong> powered by <strong>Groq API (Llama 3.3-70B)</strong> with 
            <strong> RAG (Retrieval Augmented Generation)</strong> querying a PostgreSQL database, 
            <strong> AWS S3</strong> image storage, <strong>Redis caching</strong> for API optimization, 
            and integration with <strong>IGDB</strong> (Twitch's gaming database API).
          </p>
          </Row>
          <Row>
          <p className="mb-0">
        <strong>Tech Stack:</strong> React • Redux Toolkit • Node.js • Express • PostgreSQL (JSONB) • 
        Groq API (Llama 3.3) • AWS S3 • Redis • RESTful APIs • Vercel • Railway
        </p>
          </Row>
        </Container>
      </div>
      <div>
        <Container>
          <Row>
          <h3 className="my-4 pb-2 px-1">PlayStation AI Assistant</h3>
          <hr></hr>
          <ChatPage />
          </Row>
        </Container>
      </div>

      <PopularGamesSlider />
      <div>
        <Container>
          <Row>
          <h3 className="my-4 pb-2 px-1">Technologies & Architecture</h3>
          <hr></hr>
            <ul className="list-unstyled">
              <li><strong>Frontend:</strong> React 18, Redux Toolkit, React Router, Reactstrap/Bootstrap 5</li>
              <li><strong>Backend:</strong> Node.js, Express.js, RESTful API architecture</li>
              <li><strong>Database:</strong> PostgreSQL with JSONB, complex queries, array operations</li>
              <li><strong>AI/ML:</strong> Groq API (Llama 3.3-70B), RAG (Retrieval Augmented Generation)</li>
              <li><strong>Cloud Storage:</strong> AWS S3 for scalable image hosting, IAM security</li>
              <li><strong>Caching:</strong> Redis for API optimization and performance</li>
              <li><strong>External APIs:</strong> IGDB (Twitch Gaming Database), Groq AI API</li>
              <li><strong>Deployment:</strong> Vercel (frontend), Railway (backend + PostgreSQL + Redis)</li>
              <li><strong>Version Control:</strong> Git, GitHub with PR workflow and CI/CD</li>
            </ul>

            <h3 className="my-4 pb-2 px-1">Key Features</h3>
            <hr></hr>
            <ul className="list-unstyled">
              <li>🤖 AI chatbot with RAG - queries PostgreSQL in real-time for accurate game info</li>
              <li>☁️ AWS S3 integration - automated image upload pipeline with IAM permissions</li>
              <li>⚡ Redis caching - optimized API calls with TTL-based invalidation</li>
              <li>🎮 Real-time IGDB integration - import games with metadata, images, videos</li>
              <li>🗄️ Advanced PostgreSQL - JSONB data types, array operations, full-text search</li>
              <li>🎨 Responsive UI - modern design with loading states and error handling</li>
              <li>🚀 Production deployment - environment-based config, auto-scaling infrastructure</li>
            </ul>
          </Row>
        </Container>
      </div>

      <RecentlyReviewed />       
      <BestGames />
    </>
  );
};

export default HomePage;
