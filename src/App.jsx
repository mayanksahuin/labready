import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // =========================
  // NAVIGATION
  // =========================

  const [activePage, setActivePage] = useState("dashboard");
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  // =========================
  // PROGRESS
  // =========================

  const [completedExperiments, setCompletedExperiments] = useState(() => {
    const saved = localStorage.getItem("labready_completed");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "labready_completed",
      JSON.stringify(completedExperiments)
    );
  }, [completedExperiments]);

  // =========================
  // ASSISTANT
  // =========================

  const [problemType, setProblemType] = useState("Coding Error");
  const [problem, setProblem] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // EXPERIMENT DATA
  // =========================

  const experiments = [
    {
      id: "python-1",
      number: "01",
      title: "Variables & Data Types",
      category: "Python Programming",
      description:
        "Learn how to create variables and work with basic Python data types.",
      objective:
        "Understand variables and basic Python data types such as integers, floats and strings.",
      concepts: [
        "Variables",
        "Integers",
        "Floats",
        "Strings",
        "Basic Data Types",
      ],
      code: `name = "Jayesh"
age = 18
marks = 85.5

print(name)
print(age)
print(marks)`,
      output: `Jayesh
18
85.5`,
    },
    {
      id: "python-2",
      number: "02",
      title: "Conditional Statements",
      category: "Python Programming",
      description:
        "Learn how Python makes decisions using if, elif and else.",
      objective:
        "Understand how conditional statements are used to make decisions.",
      concepts: [
        "if",
        "elif",
        "else",
        "Comparison Operators",
      ],
      code: `marks = 75

if marks >= 90:
    print("Excellent")
elif marks >= 60:
    print("Good")
else:
    print("Needs improvement")`,
      output: `Good`,
    },
    {
      id: "python-3",
      number: "03",
      title: "Loops",
      category: "Python Programming",
      description:
        "Learn how to repeat instructions using for and while loops.",
      objective:
        "Understand how loops are used to repeat a block of code.",
      concepts: [
        "for loop",
        "while loop",
        "range()",
        "Iteration",
      ],
      code: `for i in range(5):
    print(i)`,
      output: `0
1
2
3
4`,
    },
  ];

  // =========================
  // CALCULATIONS
  // =========================

  const completedCount = completedExperiments.length;

  const progress =
    experiments.length === 0
      ? 0
      : Math.round(
          (completedCount / experiments.length) * 100
        );

  // =========================
  // HELPERS
  // =========================

  const isCompleted = (id) => {
    return completedExperiments.includes(id);
  };

  const markComplete = () => {
    if (!selectedExperiment) return;

    if (!completedExperiments.includes(selectedExperiment.id)) {
      setCompletedExperiments([
        ...completedExperiments,
        selectedExperiment.id,
      ]);
    }
  };

  const openExperiment = (experiment) => {
    setSelectedExperiment(experiment);
    setActivePage("experiment");
  };

  const openAssistant = () => {
    setSelectedExperiment(null);
    setActivePage("assistant");
  };

  const openDashboard = () => {
    setSelectedExperiment(null);
    setActivePage("dashboard");
  };

  // =========================
  // AI / LOCAL ASSISTANT
  // =========================

  const getHelp = async () => {
    if (!problem.trim()) {
      alert("Please describe your problem first.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(
        "https://labready.onrender.com/api/help",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problemType,
            problem,
          }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        setResponse(data.response);
      } else {
        setResponse(data.message);
      }
    } catch (error) {
      setResponse(
        "Unable to connect to LabReady backend. Make sure Flask is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  const useExample = (type, text) => {
    setProblemType(type);
    setProblem(text);
    setResponse("");
  };

  // =========================
  // SIDEBAR
  // =========================

  const Sidebar = () => (
    <aside className="sidebar">

      <div className="brand">
        <div className="brand-icon">⚡</div>

        <div>
          <div className="brand-name">LabReady</div>
          <div className="brand-subtitle">
            AI LAB COMPANION
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">
          WORKSPACE
        </div>

        <button
          className={
            activePage === "dashboard"
              ? "side-link active"
              : "side-link"
          }
          onClick={openDashboard}
        >
          <span>⌂</span>
          Dashboard
        </button>

        <button
          className={
            activePage === "experiments" ||
            activePage === "experiment"
              ? "side-link active"
              : "side-link"
          }
          onClick={() => {
            setSelectedExperiment(null);
            setActivePage("experiments");
          }}
        >
          <span>▣</span>
          Experiments
        </button>

        <button
          className={
            activePage === "assistant"
              ? "side-link active"
              : "side-link"
          }
          onClick={openAssistant}
        >
          <span>✦</span>
          I'm Stuck
        </button>

        <button
          className={
            activePage === "progress"
              ? "side-link active"
              : "side-link"
          }
          onClick={() => {
            setSelectedExperiment(null);
            setActivePage("progress");
          }}
        >
          <span>◔</span>
          Progress
        </button>

        <button
          className={
            activePage === "catchup"
              ? "side-link active"
              : "side-link"
          }
          onClick={() => {
            setSelectedExperiment(null);
            setActivePage("catchup");
          }}
        >
          <span>↻</span>
          Catch Up
        </button>
      </div>

      <div className="sidebar-bottom">

        <div className="mini-profile">
          <div className="profile-avatar">
            J
          </div>

          <div>
            <strong>Student</strong>
            <span>LabReady Learner</span>
          </div>
        </div>

        <div className="sidebar-version">
          LabReady v1.0
        </div>

      </div>

    </aside>
  );

  // =========================
  // TOPBAR
  // =========================

  const Topbar = () => (
    <header className="topbar">

      <div className="breadcrumb">
        <span>LabReady</span>
        <b>/</b>

        <span>
          {activePage === "dashboard"
            ? "Dashboard"
            : activePage === "experiments"
            ? "Experiments"
            : activePage === "experiment"
            ? "Experiment"
            : activePage === "assistant"
            ? "I'm Stuck"
            : activePage === "progress"
            ? "Progress"
            : "Catch Up"}
        </span>
      </div>

      <div className="topbar-right">

        <div className="status-pill">
          <span className="status-dot"></span>
          Lab System Online
        </div>

        <div className="top-avatar">
          J
        </div>

      </div>

    </header>
  );

  // =========================
  // DASHBOARD
  // =========================

  const Dashboard = () => (
    <div className="content">

      <section className="welcome-section">

        <div>
          <div className="eyebrow">
            STUDENT WORKSPACE
          </div>

          <h1>
            Welcome back.
          </h1>

          <p>
            Learn, experiment and get unstuck in your
            laboratory sessions.
          </p>
        </div>

        <button
          className="purple-button"
          onClick={() => setActivePage("experiments")}
        >
          Explore Experiments →
        </button>

      </section>

      {/* STAT CARDS */}

      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon purple">
            ◈
          </div>

          <div>
            <span className="stat-title">
              Experiments
            </span>

            <strong>
              {experiments.length}
            </strong>

            <small>
              Available to learn
            </small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon green">
            ✓
          </div>

          <div>
            <span className="stat-title">
              Completed
            </span>

            <strong>
              {completedCount}
            </strong>

            <small>
              Experiments completed
            </small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon blue">
            ◔
          </div>

          <div>
            <span className="stat-title">
              Progress
            </span>

            <strong>
              {progress}%
            </strong>

            <small>
              Overall completion
            </small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon orange">
            ✦
          </div>

          <div>
            <span className="stat-title">
              Assistant
            </span>

            <strong>
              Ready
            </strong>

            <small>
              Get help anytime
            </small>
          </div>

        </div>

      </section>

      {/* MAIN DASHBOARD GRID */}

      <section className="dashboard-grid">

        <div className="dashboard-panel large-panel">

          <div className="panel-header">

            <div>
              <div className="panel-label">
                CONTINUE LEARNING
              </div>

              <h2>
                Python Programming
              </h2>
            </div>

            <button
              className="small-button"
              onClick={() => setActivePage("experiments")}
            >
              View all
            </button>

          </div>

          <div className="experiment-mini-list">

            {experiments.map((experiment) => (
              <div
                className="experiment-mini"
                key={experiment.id}
                onClick={() =>
                  openExperiment(experiment)
                }
              >

                <div className="experiment-number">
                  {experiment.number}
                </div>

                <div className="experiment-mini-info">

                  <strong>
                    {experiment.title}
                  </strong>

                  <span>
                    {experiment.description}
                  </span>

                </div>

                <div className="experiment-mini-status">

                  {isCompleted(experiment.id) ? (
                    <span className="done-label">
                      ✓ Done
                    </span>
                  ) : (
                    <span className="start-label">
                      Start →
                    </span>
                  )}

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* PROGRESS PANEL */}

        <div className="dashboard-panel progress-panel">

          <div className="panel-label">
            YOUR PROGRESS
          </div>

          <h2>
            {progress}%
          </h2>

          <p>
            Keep going. Every completed experiment
            moves you forward.
          </p>

          <div className="big-progress">

            <div
              className="big-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            ></div>

          </div>

          <div className="progress-meta">
            <span>
              {completedCount} completed
            </span>

            <span>
              {experiments.length} total
            </span>
          </div>

          <button
            className="outline-button full"
            onClick={() => setActivePage("progress")}
          >
            View Progress
          </button>

        </div>

      </section>

      {/* ASSISTANT CTA */}

      <section className="assistant-banner">

        <div className="assistant-banner-icon">
          ✦
        </div>

        <div className="assistant-banner-text">

          <div className="panel-label">
            LABREADY ASSISTANT
          </div>

          <h2>
            Stuck on something?
          </h2>

          <p>
            Describe your coding error, concept or
            experiment problem and get step-by-step help.
          </p>

        </div>

        <button
          className="purple-button"
          onClick={openAssistant}
        >
          I'm Stuck →
        </button>

      </section>

    </div>
  );

  // =========================
  // EXPERIMENTS
  // =========================

  const Experiments = () => (
    <div className="content">

      <div className="page-title">

        <div>
          <div className="eyebrow">
            LABORATORY
          </div>

          <h1>
            Experiments
          </h1>

          <p>
            Practice concepts through guided laboratory
            experiments.
          </p>
        </div>

      </div>

      <div className="lab-selector">

        <div className="lab-selector-icon">
          🐍
        </div>

        <div>
          <span>
            ACTIVE LAB
          </span>

          <strong>
            Python Programming
          </strong>
        </div>

        <div className="lab-selector-count">
          {completedCount}/{experiments.length}
        </div>

      </div>

      <div className="experiment-grid">

        {experiments.map((experiment) => (
          <div
            className="experiment-card-new"
            key={experiment.id}
            onClick={() =>
              openExperiment(experiment)
            }
          >

            <div className="experiment-card-top">

              <span className="number-badge">
                {experiment.number}
              </span>

              {isCompleted(experiment.id) && (
                <span className="completed-chip">
                  ✓ Completed
                </span>
              )}

            </div>

            <h2>
              {experiment.title}
            </h2>

            <p>
              {experiment.description}
            </p>

            <div className="experiment-card-bottom">
              <span>
                Python
              </span>

              <strong>
                Open →
              </strong>
            </div>

          </div>
        ))}

      </div>

    </div>
  );

  // =========================
  // EXPERIMENT DETAIL
  // =========================

  const ExperimentDetail = () => (
    <div className="content">

      <button
        className="back-link"
        onClick={() => {
          setSelectedExperiment(null);
          setActivePage("experiments");
        }}
      >
        ← Back to Experiments
      </button>

      <div className="experiment-detail-header">

        <div>

          <div className="eyebrow">
            PYTHON PROGRAMMING
          </div>

          <h1>
            {selectedExperiment.title}
          </h1>

          <p>
            {selectedExperiment.description}
          </p>

        </div>

        {isCompleted(selectedExperiment.id) && (
          <div className="completed-large">
            ✓ Completed
          </div>
        )}

      </div>

      <div className="detail-grid">

        <div>

          <div className="detail-panel">

            <div className="panel-label">
              OBJECTIVE
            </div>

            <h2>
              What you'll learn
            </h2>

            <p>
              {selectedExperiment.objective}
            </p>

          </div>

          <div className="detail-panel">

            <div className="panel-label">
              CONCEPTS
            </div>

            <h2>
              Key concepts
            </h2>

            <div className="concepts">

              {selectedExperiment.concepts.map(
                (concept) => (
                  <span key={concept}>
                    {concept}
                  </span>
                )
              )}

            </div>

          </div>

          <div className="detail-panel">

            <div className="panel-label">
              EXAMPLE CODE
            </div>

            <h2>
              Try this example
            </h2>

            <pre>
              <code>
                {selectedExperiment.code}
              </code>
            </pre>

          </div>

          <div className="detail-panel">

            <div className="panel-label">
              EXPECTED OUTPUT
            </div>

            <h2>
              Your result should look like
            </h2>

            <pre className="output-code">
              {selectedExperiment.output}
            </pre>

          </div>

        </div>

        <aside className="detail-sidebar">

          <div className="action-panel">

            <div className="panel-label">
              EXPERIMENT ACTIONS
            </div>

            <button
              className="purple-button full"
              onClick={markComplete}
            >
              {isCompleted(selectedExperiment.id)
                ? "✓ Experiment Completed"
                : "✓ Mark Complete"}
            </button>

            <button
              className="outline-button full"
              onClick={openAssistant}
            >
              ✦ I'm Stuck
            </button>

          </div>

          <div className="pinpoint-panel">

            <div className="pinpoint-icon">
              !
            </div>

            <div>
              <div className="panel-label">
                PINPOINT
              </div>

              <p>
                Read the error message carefully before
                changing your code.
              </p>
            </div>

          </div>

        </aside>

      </div>

    </div>
  );

  // =========================
  // ASSISTANT PAGE
  // =========================

  const Assistant = () => (
    <div className="content">

      <div className="page-title">

        <div>
          <div className="eyebrow">
            LABREADY ASSISTANT
          </div>

          <h1>
            I'm Stuck
          </h1>

          <p>
            Tell LabReady what went wrong and get
            step-by-step troubleshooting help.
          </p>
        </div>

      </div>

      <div className="assistant-layout">

        <div className="assistant-main">

          <div className="assistant-types">

            {[
              "Coding Error",
              "Concept",
              "Software Issue",
              "Experiment Step",
            ].map((type) => (
              <button
                key={type}
                className={
                  problemType === type
                    ? "assistant-type active"
                    : "assistant-type"
                }
                onClick={() => {
                  setProblemType(type);
                  setResponse("");
                }}
              >
                {type}
              </button>
            ))}

          </div>

          <div className="assistant-input-panel">

            <div className="assistant-panel-header">

              <div>
                <div className="panel-label">
                  PROBLEM TYPE
                </div>

                <h2>
                  {problemType}
                </h2>
              </div>

              <div className="assistant-status">
                <span></span>
                Assistant Ready
              </div>

            </div>

            <textarea
              value={problem}
              onChange={(e) =>
                setProblem(e.target.value)
              }
              placeholder="Describe what you're stuck on..."
            />

            <div className="assistant-footer">

              <span>
                Be as specific as possible.
              </span>

              <button
                className="purple-button"
                onClick={getHelp}
                disabled={loading}
              >
                {loading
                  ? "Thinking..."
                  : "Get Help →"}
              </button>

            </div>

          </div>

          <div className="example-box">

            <div className="panel-label">
              QUICK EXAMPLES
            </div>

            <div className="example-buttons">

              <button
                onClick={() =>
                  useExample(
                    "Coding Error",
                    "NameError: name 'total' is not defined"
                  )
                }
              >
                NameError
              </button>

              <button
                onClick={() =>
                  useExample(
                    "Concept",
                    "I don't understand Python variables"
                  )
                }
              >
                Variables
              </button>

              <button
                onClick={() =>
                  useExample(
                    "Software Issue",
                    "Python is installed but the command is not working"
                  )
                }
              >
                Python Issue
              </button>

            </div>

          </div>

          {response && (
            <div className="assistant-response">

              <div className="response-header">

                <div className="response-icon">
                  ✦
                </div>

                <div>
                  <div className="panel-label">
                    LABREADY ASSISTANT
                  </div>

                  <strong>
                    Troubleshooting Guide
                  </strong>
                </div>

              </div>

              <div className="response-text">
                {response}
              </div>

            </div>
          )}

        </div>

        <aside className="assistant-side">

          <div className="assistant-info-card">

            <div className="info-icon">
              ✦
            </div>

            <h3>
              How LabReady helps
            </h3>

            <p>
              Describe your problem and LabReady will
              guide you through the next steps.
            </p>

            <div className="help-list">

              <div>
                <span>01</span>
                Understand the problem
              </div>

              <div>
                <span>02</span>
                Find the likely cause
              </div>

              <div>
                <span>03</span>
                Try the solution
              </div>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );

  // =========================
  // PROGRESS PAGE
  // =========================

  const ProgressPage = () => (
    <div className="content">

      <div className="page-title">

        <div>
          <div className="eyebrow">
            YOUR LEARNING
          </div>

          <h1>
            Progress
          </h1>

          <p>
            Track your laboratory learning journey.
          </p>
        </div>

      </div>

      <div className="progress-hero">

        <div>

          <div className="panel-label">
            OVERALL PROGRESS
          </div>

          <h2>
            {progress}%
          </h2>

          <p>
            {completedCount} of {experiments.length}
            {" "}experiments completed
          </p>

        </div>

        <div className="progress-ring">
          <div>
            <strong>{progress}%</strong>
            <span>Complete</span>
          </div>
        </div>

      </div>

      <div className="progress-list">

        {experiments.map((experiment) => (
          <div
            className="progress-row"
            key={experiment.id}
          >

            <div className="progress-row-number">
              {isCompleted(experiment.id)
                ? "✓"
                : experiment.number}
            </div>

            <div className="progress-row-info">

              <strong>
                {experiment.title}
              </strong>

              <span>
                {isCompleted(experiment.id)
                  ? "Completed"
                  : "Not completed"}
              </span>

            </div>

            <button
              className="outline-button"
              onClick={() =>
                openExperiment(experiment)
              }
            >
              {isCompleted(experiment.id)
                ? "Review"
                : "Start"}
            </button>

          </div>
        ))}

      </div>

    </div>
  );

  // =========================
  // CATCH UP
  // =========================

  const CatchUp = () => {
    const remaining = experiments.filter(
      (experiment) =>
        !completedExperiments.includes(experiment.id)
    );

    return (
      <div className="content">

        <div className="page-title">

          <div>
            <div className="eyebrow">
              CATCH UP
            </div>

            <h1>
              Get Back on Track
            </h1>

            <p>
              Continue the experiments you haven't
              completed yet.
            </p>
          </div>

        </div>

        {remaining.length === 0 ? (
          <div className="empty-state">

            <div className="empty-icon">
              ✓
            </div>

            <h2>
              You're all caught up!
            </h2>

            <p>
              You have completed every available
              experiment.
            </p>

          </div>
        ) : (
          <div className="catchup-grid">

            {remaining.map((experiment) => (
              <div
                className="catchup-card"
                key={experiment.id}
                onClick={() =>
                  openExperiment(experiment)
                }
              >

                <span>
                  EXPERIMENT {experiment.number}
                </span>

                <h2>
                  {experiment.title}
                </h2>

                <p>
                  {experiment.description}
                </p>

                <strong>
                  Continue →
                </strong>

              </div>
            ))}

          </div>
        )}

      </div>
    );
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="app">

      <Sidebar />

      <div className="main-area">

        <Topbar />

        {activePage === "dashboard" && (
          <Dashboard />
        )}

        {activePage === "experiments" && (
          <Experiments />
        )}

        {activePage === "experiment" &&
          selectedExperiment && (
            <ExperimentDetail />
          )}

        {activePage === "assistant" && (
          <Assistant />
        )}

        {activePage === "progress" && (
          <ProgressPage />
        )}

        {activePage === "catchup" && (
          <CatchUp />
        )}

        <footer className="footer">
          LabReady • Learn. Experiment. Get Unstuck.
        </footer>

      </div>

    </div>
  );
}

export default App;
