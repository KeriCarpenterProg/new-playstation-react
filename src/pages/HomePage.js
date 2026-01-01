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
          <h3 className="my-4 pb-2 px-1">Full-Stack AI Chatbot Site Programmed by Keri Carpenter 2026</h3>
          <hr></hr>
            <p>
            This website deployed by Keri Carpenter demonstrates modern full-stack development with <strong>React</strong>, 
            <strong>Node.js/Express</strong>, and <strong>PostgreSQL</strong>. Features include 
            real-time API integration with IGDB (Twitch's gaming database), advanced database 
            queries with JSONB support, and a custom AI chatbot powered by <strong>Llama 3</strong> 
            with <strong>RAG (Retrieval Augmented Generation)</strong>.           
          </p>
          </Row>
          <Row>
          <p className="mb-0">
        <strong>Tech Stack:</strong> React • Redux Toolkit • Node.js • Express • PostgreSQL • 
        Ollama/Llama 3 • RESTful APIs • Deployed on Render.com
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
              <li><strong>Frontend:</strong> React 18, Redux Toolkit, React Router, Reactstrap/Bootstrap</li>
              <li><strong>Backend:</strong> Node.js, Express.js, RESTful API design</li>
              <li><strong>Database:</strong> PostgreSQL with JSONB, complex queries, full-text search</li>
              <li><strong>AI/ML:</strong> Ollama, Llama 3, RAG (Retrieval Augmented Generation)</li>
              <li><strong>External APIs:</strong> IGDB (Internet Game Database) integration</li>
              <li><strong>Deployment:</strong> Full-stack deployment on Render.com</li>
              <li><strong>Version Control:</strong> Git, GitHub with PR workflow</li>
            </ul>

            <h3 className="my-4 pb-2 px-1">Key Features</h3>
            <hr></hr>
            <ul className="list-unstyled">
              <li>AI-powered chatbot with database-augmented responses (RAG)</li>
              <li>Real-time game data import from IGDB API</li>
              <li>Advanced PostgreSQL queries with array and JSONB data types</li>
              <li>Responsive UI with modern design patterns</li>
              <li>Full CRUD operations with error handling</li>
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
