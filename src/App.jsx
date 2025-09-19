import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CollectionPage from "./components/common/CollectionPage";
import PerkForm from "./pages/PerkForm";
import OfferForm from "./pages/OfferForm";
import PlaceForm from "./pages/PlaceForm";
import Navbar from "./components/common/Navbar";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import { appStyles } from "./styles/layoutStyles.style";
import NonMemberForm from "./pages/NonMemberForm";
import EliteForm from "./pages/EliteForm";

// Collection configurations
const COLLECTIONS = {
  PERKS: {
    id: "689046505062d22cb6485ac6",
    name: "Perks",
    description: "Manage your perks and special offers for members.",
  },
  OFFERS: {
    id: "686cd18f382b5b2f1dcc787b",
    name: "Free Member Offers",
    description: "Manage available Free offers and deals.",
  },
  ELITE: {
    id: "68c9944867e93829d28f767f",
    name: "Elite Member Offers",
    description: "Manage available Elite offers and deals.",
  },
  NON_MEMBERS: {
    id: "68cab08b7569afdf5b23fd30",
    name: "Non Member Offers",
    description: "Manage available Non Member offers and deals.",
  },
  PLACES: {
    id: "688b15b04ee8c4d17f71c5c3",
    name: "Places",
    description: "Manage locations and venues.",
  },
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div style={appStyles.appContainer}>
          <Navbar />
          <main style={appStyles.mainContent}>
            <Routes>
              {/* Perks Routes */}
              <Route
                path="/"
                element={
                  <CollectionPage
                    collectionId={COLLECTIONS.PERKS.id}
                    title={COLLECTIONS.PERKS.name}
                    description={COLLECTIONS.PERKS.description}
                  />
                }
              />
              <Route path="/perks/add" element={<PerkForm />} />
              <Route path="/perks/edit/:id" element={<PerkForm />} />

              {/* Offers Routes */}
              <Route
                path="/offers"
                element={
                  <CollectionPage
                    collectionId={COLLECTIONS.OFFERS.id}
                    title={COLLECTIONS.OFFERS.name}
                    description={COLLECTIONS.OFFERS.description}
                  />
                }
              />
              <Route path="/offers/add" element={<OfferForm />} />
              <Route path="/offers/edit/:id" element={<OfferForm />} />

              {/* Elite Member Offer */}
              <Route
                path="/elite-offers"
                element={
                  <CollectionPage
                    collectionId={COLLECTIONS.ELITE.id}
                    title={COLLECTIONS.ELITE.name}
                    description={COLLECTIONS.ELITE.description}
                  />
                }
              />
              <Route path="/elite-offers/add" element={<EliteForm />} />
              <Route path="/elite-offers/edit/:id" element={<EliteForm />} />

              {/* Non Member Offer */}
              <Route
                path="/non-members-offers"
                element={
                  <CollectionPage
                    collectionId={COLLECTIONS.NON_MEMBERS.id}
                    title={COLLECTIONS.NON_MEMBERS.name}
                    description={COLLECTIONS.NON_MEMBERS.description}
                  />
                }
              />
              <Route
                path="/non-members-offers/add"
                element={<NonMemberForm />}
              />
              <Route
                path="/non-members-offers/edit/:id"
                element={<NonMemberForm />}
              />

              {/* Places Routes */}
              <Route
                path="/places"
                element={
                  <CollectionPage
                    collectionId={COLLECTIONS.PLACES.id}
                    title={COLLECTIONS.PLACES.name}
                    description={COLLECTIONS.PLACES.description}
                  />
                }
              />
              <Route path="/places/add" element={<PlaceForm />} />
              <Route path="/places/edit/:id" element={<PlaceForm />} />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
