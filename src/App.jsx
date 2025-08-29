import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CollectionsList from "./components/common/CollectionsList";
import PerkForm from "./pages/PerkForm";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome to your Webflow Dashboard
                      </h2>
                      <p className="text-gray-600">
                        Manage your Webflow collections and content with ease.
                      </p>
                    </div>
                    <CollectionsList />
                  </>
                }
              />
              <Route path="/perks/add" element={<PerkForm />} />
              <Route path="/perks/edit/:id" element={<PerkForm />} />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
