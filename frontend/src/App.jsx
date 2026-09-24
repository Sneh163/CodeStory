import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/requirements";
const EVENTS_API_URL = "http://localhost:8080/api/events";

function App() {

  // =========================================================
  // GENERAL
  // =========================================================

  const [activePage, setActivePage] = useState("Dashboard");


  // =========================================================
  // REQUIREMENTS
  // =========================================================

  const [requirements, setRequirements] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [selectedRequirement, setSelectedRequirement] =
    useState(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [status, setStatus] = useState("ACTIVE");

  const [loading, setLoading] = useState(false);


  // =========================================================
  // REQUIREMENT VERSIONS
  // =========================================================

  const [versions, setVersions] = useState([]);

  const [showVersionForm, setShowVersionForm] =
    useState(false);

  const [versionTitle, setVersionTitle] = useState("");

  const [versionDescription, setVersionDescription] =
    useState("");

  const [versionStatus, setVersionStatus] =
    useState("ACTIVE");

  const [versionLoading, setVersionLoading] =
    useState(false);


  // =========================================================
  // VERSION DETAILS
  // =========================================================

  const [selectedVersion, setSelectedVersion] =
    useState(null);

  const [versionDetailsLoading, setVersionDetailsLoading] =
    useState(false);


  // =========================================================
  // VERSION COMPARISON
  // =========================================================

  const [comparisonData, setComparisonData] =
    useState(null);

  const [comparisonLoading, setComparisonLoading] =
    useState(false);


  // =========================================================
  // ENGINEERING DECISIONS
  // =========================================================

  const [decisions, setDecisions] = useState([]);

  const [selectedDecision, setSelectedDecision] =
    useState(null);

  const [showDecisionForm, setShowDecisionForm] =
    useState(false);

  const [decisionLoading, setDecisionLoading] =
    useState(false);

  const [decisionTitle, setDecisionTitle] =
    useState("");

  const [decisionType, setDecisionType] =
    useState("ARCHITECTURE");

  const [decisionRationale, setDecisionRationale] =
    useState("");

  const [implementationReference, setImplementationReference] =
    useState("");

  const [supportingEvidence, setSupportingEvidence] =
    useState("");

  const [decisionRequirementId, setDecisionRequirementId] =
    useState("");


  // =========================================================
  // IMPACT ANALYSIS
  // =========================================================

  const [impactAnalyses, setImpactAnalyses] =
    useState([]);

  const [selectedImpact, setSelectedImpact] =
    useState(null);

  const [showImpactForm, setShowImpactForm] =
    useState(false);

  const [impactLoading, setImpactLoading] =
    useState(false);

  const [impactRequirementId, setImpactRequirementId] =
    useState("");

  const [changeType, setChangeType] =
    useState("REQUIREMENT_CHANGE");

  const [impactSummary, setImpactSummary] =
    useState("");

  const [affectedModules, setAffectedModules] =
    useState("");

  const [affectedSourceFiles, setAffectedSourceFiles] =
    useState("");

  const [affectedApis, setAffectedApis] =
    useState("");

  const [affectedFunctionalities, setAffectedFunctionalities] =
    useState("");


  // =========================================================
  // EVOLUTION TIMELINE
  // =========================================================

  const [projectEvents, setProjectEvents] = useState([]);

  const [eventsLoading, setEventsLoading] =
    useState(false);


  // =========================================================
  // LOAD REQUIREMENTS
  // =========================================================

  const loadRequirements = async () => {

    try {

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to load requirements"
        );
      }

      const data = await response.json();

      setRequirements(data);

    } catch (error) {

      console.error(
        "Error loading requirements:",
        error
      );

    }
  };


  // =========================================================
  // LOAD PROJECT EVENTS
  // =========================================================

  const loadProjectEvents = async () => {

    setEventsLoading(true);

    try {

      const response = await fetch(
        EVENTS_API_URL
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load project events"
        );
      }

      const data = await response.json();

      setProjectEvents(data);

    } catch (error) {

      console.error(
        "Error loading project events:",
        error
      );

      setProjectEvents([]);

    } finally {

      setEventsLoading(false);

    }
  };


  // =========================================================
  // LOAD ENGINEERING DECISIONS
  // =========================================================

  const loadDecisions = async () => {

    try {

      const allDecisions = [];

      for (const requirement of requirements) {

        try {

          const response = await fetch(
            `${API_URL}/${requirement.id}/decisions`
          );

          if (response.ok) {

            const data = await response.json();

            allDecisions.push(...data);

          }

        } catch (error) {

          console.error(
            `Could not load decisions for requirement ${requirement.id}`,
            error
          );

        }
      }

      setDecisions(allDecisions);

    } catch (error) {

      console.error(
        "Error loading decisions:",
        error
      );

    }
  };


  // =========================================================
  // LOAD IMPACT ANALYSES
  // =========================================================

  const loadImpactAnalyses = async () => {

    try {

      const allAnalyses = [];

      for (const requirement of requirements) {

        try {

          const response = await fetch(
            `${API_URL}/${requirement.id}/impact-analysis`
          );

          if (response.ok) {

            const data = await response.json();

            allAnalyses.push(...data);

          }

        } catch (error) {

          console.error(
            `Could not load impact analyses for requirement ${requirement.id}`,
            error
          );

        }
      }

      setImpactAnalyses(allAnalyses);

    } catch (error) {

      console.error(
        "Error loading impact analyses:",
        error
      );

    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadRequirements();
    loadProjectEvents();

  }, []);


  // =========================================================
  // LOAD RELATED DATA
  // =========================================================

  useEffect(() => {

    if (requirements.length > 0) {

      loadDecisions();

      loadImpactAnalyses();

    } else {

      setDecisions([]);

      setImpactAnalyses([]);

    }

  }, [requirements]);


  // =========================================================
  // CREATE REQUIREMENT
  // =========================================================

  const createRequirement = async (event) => {

    event.preventDefault();

    if (!title.trim()) {

      alert(
        "Please enter a requirement title."
      );

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title,
            description,
            status,
          }),
        }
      );

      if (!response.ok) {

        throw new Error(
          "Failed to create requirement"
        );

      }

      setTitle("");

      setDescription("");

      setStatus("ACTIVE");

      setShowForm(false);

      await loadRequirements();

    } catch (error) {

      console.error(
        "Error creating requirement:",
        error
      );

      alert(
        "Could not create requirement. Make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // LOAD VERSIONS
  // =========================================================

  const loadVersions = async (requirementId) => {

    try {

      const response = await fetch(
        `${API_URL}/${requirementId}/versions`
      );

      if (!response.ok) {

        throw new Error(
          "Failed to load versions"
        );

      }

      const data = await response.json();

      setVersions(data);

    } catch (error) {

      console.error(
        "Error loading versions:",
        error
      );

      setVersions([]);

    }
  };


  // =========================================================
  // VIEW REQUIREMENT
  // =========================================================

  const viewRequirement = async (requirement) => {

    setSelectedRequirement(requirement);

    setSelectedVersion(null);

    setComparisonData(null);

    setShowVersionForm(false);

    setVersions([]);

    await loadVersions(requirement.id);

  };


  // =========================================================
  // OPEN VERSION FORM
  // =========================================================

  const openVersionForm = () => {

    if (!selectedRequirement) {
      return;
    }

    setVersionTitle(
      selectedRequirement.title
    );

    setVersionDescription(
      selectedRequirement.description || ""
    );

    setVersionStatus(
      selectedRequirement.status || "ACTIVE"
    );

    setShowVersionForm(true);

  };


  // =========================================================
  // CREATE VERSION
  // =========================================================

  const createVersion = async (event) => {

    event.preventDefault();

    if (!versionTitle.trim()) {

      alert(
        "Please enter a version title."
      );

      return;
    }

    if (!selectedRequirement) {
      return;
    }

    setVersionLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/${selectedRequirement.id}/versions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: versionTitle,
            description: versionDescription,
            status: versionStatus,
          }),
        }
      );

      if (!response.ok) {

        throw new Error(
          "Failed to create version"
        );

      }

      await loadVersions(
        selectedRequirement.id
      );

      const requirementsResponse =
        await fetch(API_URL);

      if (requirementsResponse.ok) {

        const requirementsData =
          await requirementsResponse.json();

        setRequirements(
          requirementsData
        );

        const updatedRequirement =
          requirementsData.find(
            (item) =>
              item.id ===
              selectedRequirement.id
          );

        if (updatedRequirement) {

          setSelectedRequirement(
            updatedRequirement
          );

        }
      }

      setVersionTitle("");

      setVersionDescription("");

      setVersionStatus("ACTIVE");

      setShowVersionForm(false);

    } catch (error) {

      console.error(
        "Error creating version:",
        error
      );

      alert(
        "Could not create version."
      );

    } finally {

      setVersionLoading(false);

    }
  };


  // =========================================================
  // VIEW VERSION
  // =========================================================

  const viewVersion = async (version) => {

    setVersionDetailsLoading(true);

    setComparisonData(null);

    try {

      const response = await fetch(
        `${API_URL}/versions/${version.id}`
      );

      if (!response.ok) {

        throw new Error(
          "Failed to load version details"
        );

      }

      const data = await response.json();

      setSelectedVersion(data);

    } catch (error) {

      console.error(
        "Error loading version:",
        error
      );

      alert(
        "Could not load version details."
      );

    } finally {

      setVersionDetailsLoading(false);

    }
  };


  // =========================================================
  // COMPARE VERSIONS
  // =========================================================

  const compareVersions = async (
    versionId,
    otherVersionId
  ) => {

    setComparisonLoading(true);

    setComparisonData(null);

    try {

      const response = await fetch(
        `${API_URL}/versions/${versionId}/compare/${otherVersionId}`
      );

      if (!response.ok) {

        throw new Error(
          "Failed to compare versions"
        );

      }

      const data = await response.json();

      setComparisonData(data);

    } catch (error) {

      console.error(
        "Error comparing versions:",
        error
      );

      alert(
        "Could not compare versions."
      );

    } finally {

      setComparisonLoading(false);

    }
  };


  // =========================================================
  // COMPARE WITH PREVIOUS
  // =========================================================

  const compareWithPrevious = () => {

    if (!selectedVersion) {
      return;
    }

    const currentVersionNumber =
      selectedVersion.versionNumber;

    const previousVersion =
      versions.find(
        (version) =>
          version.versionNumber ===
          currentVersionNumber - 1
      );

    if (!previousVersion) {

      alert(
        "This version does not have a previous version."
      );

      return;

    }

    compareVersions(
      selectedVersion.id,
      previousVersion.id
    );

  };


  // =========================================================
  // CREATE ENGINEERING DECISION
  // =========================================================

  const createDecision = async (event) => {

    event.preventDefault();

    if (!decisionRequirementId) {

      alert(
        "Please select a requirement."
      );

      return;
    }

    if (!decisionTitle.trim()) {

      alert(
        "Please enter a decision title."
      );

      return;
    }

    setDecisionLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/${decisionRequirementId}/decisions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: decisionTitle,
            type: decisionType,
            rationale: decisionRationale,
            implementationReference,
            supportingEvidence,
          }),
        }
      );

      if (!response.ok) {

        throw new Error(
          "Failed to create engineering decision"
        );

      }

      setDecisionTitle("");

      setDecisionType("ARCHITECTURE");

      setDecisionRationale("");

      setImplementationReference("");

      setSupportingEvidence("");

      setDecisionRequirementId("");

      setShowDecisionForm(false);

      await loadDecisions();

    } catch (error) {

      console.error(
        "Error creating decision:",
        error
      );

      alert(
        "Could not create engineering decision."
      );

    } finally {

      setDecisionLoading(false);

    }
  };


  // =========================================================
  // VIEW DECISION
  // =========================================================

  const viewDecision = async (decision) => {

    try {

      const response = await fetch(
        `${API_URL}/decisions/${decision.id}`
      );

      if (!response.ok) {

        throw new Error(
          "Failed to load decision"
        );

      }

      const data = await response.json();

      setSelectedDecision(data);

    } catch (error) {

      console.error(
        "Error loading decision:",
        error
      );

      setSelectedDecision(decision);

    }
  };


  // =========================================================
  // OPEN DECISION FORM
  // =========================================================

  const openDecisionForm = () => {

    setDecisionTitle("");

    setDecisionType("ARCHITECTURE");

    setDecisionRationale("");

    setImplementationReference("");

    setSupportingEvidence("");

    setDecisionRequirementId(
      requirements.length > 0
        ? String(requirements[0].id)
        : ""
    );

    setShowDecisionForm(true);

  };


  // =========================================================
  // CREATE IMPACT ANALYSIS
  // =========================================================

  const createImpactAnalysis = async (event) => {

    event.preventDefault();

    if (!impactRequirementId) {

      alert(
        "Please select a requirement."
      );

      return;
    }

    if (!impactSummary.trim()) {

      alert(
        "Please enter an impact summary."
      );

      return;
    }

    setImpactLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/${impactRequirementId}/impact-analysis`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            changeType,
            summary: impactSummary,
            affectedModules,
            affectedSourceFiles,
            affectedApis,
            affectedFunctionalities,
          }),
        }
      );

      if (!response.ok) {

        throw new Error(
          "Failed to create impact analysis"
        );

      }

      setImpactSummary("");

      setChangeType(
        "REQUIREMENT_CHANGE"
      );

      setAffectedModules("");

      setAffectedSourceFiles("");

      setAffectedApis("");

      setAffectedFunctionalities("");

      setImpactRequirementId("");

      setShowImpactForm(false);

      await loadImpactAnalyses();

    } catch (error) {

      console.error(
        "Error creating impact analysis:",
        error
      );

      alert(
        "Could not create impact analysis."
      );

    } finally {

      setImpactLoading(false);

    }
  };


  // =========================================================
  // OPEN IMPACT FORM
  // =========================================================

  const openImpactForm = () => {

    setImpactSummary("");

    setChangeType(
      "REQUIREMENT_CHANGE"
    );

    setAffectedModules("");

    setAffectedSourceFiles("");

    setAffectedApis("");

    setAffectedFunctionalities("");

    setImpactRequirementId(
      requirements.length > 0
        ? String(requirements[0].id)
        : ""
    );

    setShowImpactForm(true);

  };


  // =========================================================
  // VIEW IMPACT ANALYSIS
  // =========================================================

  const viewImpact = async (analysis) => {

    try {

      const response = await fetch(
        `${API_URL}/impact-analysis/${analysis.id}`
      );

      if (!response.ok) {

        throw new Error(
          "Failed to load impact analysis"
        );

      }

      const data = await response.json();

      setSelectedImpact(data);

    } catch (error) {

      console.error(
        "Error loading impact analysis:",
        error
      );

      setSelectedImpact(analysis);

    }
  };


  // =========================================================
  // CLOSE MODALS
  // =========================================================

  const closeRequirementDetails = () => {

    setSelectedRequirement(null);

    setSelectedVersion(null);

    setComparisonData(null);

    setVersions([]);

    setShowVersionForm(false);

  };


  const closeVersionDetails = () => {

    setSelectedVersion(null);

    setComparisonData(null);

  };


  const closeComparison = () => {

    setComparisonData(null);

  };


  const closeDecision = () => {

    setSelectedDecision(null);

  };


  const closeImpact = () => {

    setSelectedImpact(null);

  };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {

    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString();

  };


  // =========================================================
  // EVOLUTION TIMELINE
  // =========================================================

  const getEventIcon = (eventType) => {

    const type = (eventType || "").toUpperCase();

    if (type.includes("CREATED")) {
      return "+";
    }

    if (
      type.includes("VERSION") ||
      type.includes("UPDATED") ||
      type.includes("MODIFIED")
    ) {
      return "↻";
    }

    if (
      type.includes("DECISION") ||
      type.includes("COMPLETED")
    ) {
      return "✓";
    }

    if (
      type.includes("IMPACT") ||
      type.includes("CHANGE")
    ) {
      return "!";
    }

    return "•";
  };


  const renderEvolutionTimeline = () => (

    <>

      <header className="topbar">

        <div>

          <h1>
            Evolution Timeline
          </h1>

          <p>
            Track how CodeStory has evolved over time
          </p>

        </div>

      </header>


      <section className="section">

        <div className="section-header">

          <div>

            <h2>
              Project Evolution
            </h2>

            <p>
              Chronological history of requirements, versions,
              decisions and project events
            </p>

          </div>

          <button
            className="secondary-button"
            onClick={loadProjectEvents}
            disabled={eventsLoading}
          >
            {eventsLoading ? "Refreshing..." : "Refresh"}
          </button>

        </div>


        {eventsLoading && projectEvents.length === 0 ? (

          <div className="empty-state">
            Loading project events...
          </div>

        ) : projectEvents.length === 0 ? (

          <div className="empty-state">
            No project events found.
          </div>

        ) : (

          <div className="requirement-list">

            {projectEvents.map(
              (event) => (

                <div
                  className="requirement-card"
                  key={event.id}
                  style={{
                    alignItems: "center",
                  }}
                >

                  <div
                    className="activity-icon"
                    style={{
                      flexShrink: 0,
                      marginRight: "22px",
                    }}
                  >
                    {getEventIcon(event.eventType)}
                  </div>


                  <div
                    style={{
                      flex: 1,
                    }}
                  >

                    <div
                      className="requirement-id"
                    >
                      EVENT-
                      {String(event.id).padStart(3, "0")}
                    </div>


                    <h3>
                      {event.eventType}
                    </h3>


                    <p>
                      {event.description ||
                        "No event description available."}
                    </p>


                    <div
                      style={{
                        marginTop: "12px",
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >

                      <strong>
                        Timestamp:
                      </strong>{" "}

                      {formatDate(event.timestamp)}

                    </div>

                  </div>


                  <div
                    className="requirement-right"
                  >

                    <span className="status">
                      PROJECT EVENT
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </>

  );


  // =========================================================
  // DASHBOARD
  // =========================================================

  const renderDashboard = () => (

    <>

      <header className="topbar">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Unified Developer Intelligence Platform
          </p>

        </div>


        <div className="search">

          🔍

          <input
            type="text"
            placeholder="Search CodeStory..."
          />

        </div>

      </header>


      <section className="stats">

        <div className="stat-card">

          <span>
            Requirements
          </span>

          <strong>
            {requirements.length}
          </strong>

          <small>
            Active requirements
          </small>

        </div>


        <div className="stat-card">

          <span>
            Decisions
          </span>

          <strong>
            {decisions.length}
          </strong>

          <small>
            Engineering decisions
          </small>

        </div>


        <div className="stat-card">

          <span>
            Impact Analyses
          </span>

          <strong>
            {impactAnalyses.length}
          </strong>

          <small>
            Analyses performed
          </small>

        </div>


        <div className="stat-card">

          <span>
            Artefacts
          </span>

          <strong>
            0
          </strong>

          <small>
            Engineering artefacts
          </small>

        </div>

      </section>


      <section className="section">

        <div className="section-header">

          <div>

            <h2>
              Recent Requirements
            </h2>

            <p>
              Latest requirements added to the project
            </p>

          </div>


          <button
            className="primary-button"
            onClick={() =>
              setShowForm(true)
            }
          >
            + New Requirement
          </button>

        </div>


        <div className="requirement-list">

          {requirements.length === 0 ? (

            <div className="empty-state">
              No requirements found.
            </div>

          ) : (

            requirements.map(
              (requirement) => (

                <div
                  className="requirement-card"
                  key={requirement.id}
                >

                  <div>

                    <div className="requirement-id">

                      REQ-
                      {String(
                        requirement.id
                      ).padStart(3, "0")}

                    </div>


                    <h3>
                      {requirement.title}
                    </h3>


                    <p>
                      {requirement.description}
                    </p>

                  </div>


                  <div className="requirement-right">

                    <span className="status">
                      {requirement.status}
                    </span>


                    <button
                      className="view-button"
                      onClick={() =>
                        viewRequirement(
                          requirement
                        )
                      }
                    >
                      View
                    </button>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </section>


      <section className="section">

        <div className="section-header">

          <div>

            <h2>
              Project Activity
            </h2>

            <p>
              Recent changes across CodeStory
            </p>

          </div>

        </div>


        <div className="activity-item">

          <div className="activity-icon">
            +
          </div>

          <div>

            <strong>
              Requirement created
            </strong>

            <p>
              User Authentication
            </p>

          </div>

          <span>
            Recently
          </span>

        </div>


        <div className="activity-item">

          <div className="activity-icon">
            ✓
          </div>

          <div>

            <strong>
              Engineering decision created
            </strong>

            <p>
              Use Multi-Factor Authentication
            </p>

          </div>

          <span>
            Recently
          </span>

        </div>


        <div className="activity-item">

          <div className="activity-icon">
            !
          </div>

          <div>

            <strong>
              Impact analysis performed
            </strong>

            <p>
              User Authentication
            </p>

          </div>

          <span>
            Recently
          </span>

        </div>

      </section>

    </>
  );


  // =========================================================
  // REQUIREMENTS PAGE
  // =========================================================

  const renderRequirements = () => (

    <>

      <header className="topbar">

        <div>

          <h1>
            Requirements
          </h1>

          <p>
            Manage project requirements and their evolution
          </p>

        </div>


        <button
          className="primary-button"
          onClick={() =>
            setShowForm(true)
          }
        >
          + New Requirement
        </button>

      </header>


      <section className="section">

        <div className="requirement-list">

          {requirements.map(
            (requirement) => (

              <div
                className="requirement-card"
                key={requirement.id}
              >

                <div>

                  <div className="requirement-id">

                    REQ-
                    {String(
                      requirement.id
                    ).padStart(3, "0")}

                  </div>


                  <h3>
                    {requirement.title}
                  </h3>


                  <p>
                    {requirement.description}
                  </p>

                </div>


                <div className="requirement-right">

                  <span className="status">
                    {requirement.status}
                  </span>


                  <button
                    className="view-button"
                    onClick={() =>
                      viewRequirement(
                        requirement
                      )
                    }
                  >
                    View
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </section>

    </>
  );


  // =========================================================
  // ENGINEERING DECISIONS PAGE
  // =========================================================

  const renderDecisions = () => (

    <>

      <header className="topbar">

        <div>

          <h1>
            Engineering Decisions
          </h1>

          <p>
            Capture technical decisions and their rationale
          </p>

        </div>


        <button
          className="primary-button"
          onClick={openDecisionForm}
        >
          + New Decision
        </button>

      </header>


      <section className="section">

        <div className="section-header">

          <div>

            <h2>
              Decision Records
            </h2>

            <p>
              Engineering decisions linked to project requirements
            </p>

          </div>

        </div>


        {decisions.length === 0 ? (

          <div className="empty-state">

            No engineering decisions found.

          </div>

        ) : (

          <div className="requirement-list">

            {decisions.map(
              (decision) => (

                <div
                  className="requirement-card"
                  key={decision.id}
                >

                  <div>

                    <div className="requirement-id">

                      DEC-
                      {String(
                        decision.id
                      ).padStart(3, "0")}

                    </div>


                    <h3>
                      {decision.title}
                    </h3>


                    <p>
                      {decision.rationale}
                    </p>


                    <div
                      style={{
                        marginTop: "10px",
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >

                      <strong>
                        Type:
                      </strong>{" "}

                      {decision.type}

                      {" • "}

                      <strong>
                        Requirement:
                      </strong>{" "}

                      {decision.requirement?.title ||
                        "Unknown"}

                    </div>

                  </div>


                  <div className="requirement-right">

                    <span className="status">
                      LINKED
                    </span>


                    <button
                      className="view-button"
                      onClick={() =>
                        viewDecision(
                          decision
                        )
                      }
                    >
                      View
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </>
  );


  // =========================================================
  // IMPACT ANALYSIS PAGE
  // =========================================================

  const renderImpactAnalysis = () => (

    <>

      <header className="topbar">

        <div>

          <h1>
            Impact Analysis
          </h1>

          <p>
            Analyze the potential impact of requirement changes
          </p>

        </div>


        <button
          className="primary-button"
          onClick={openImpactForm}
        >
          + New Impact Analysis
        </button>

      </header>


      <section className="section">

        <div className="section-header">

          <div>

            <h2>
              Impact Analysis Records
            </h2>

            <p>
              Identify potentially affected modules, files, APIs and functionalities
            </p>

          </div>

        </div>


        {impactAnalyses.length === 0 ? (

          <div className="empty-state">

            No impact analyses found.

          </div>

        ) : (

          <div className="requirement-list">

            {impactAnalyses.map(
              (analysis) => (

                <div
                  className="requirement-card"
                  key={analysis.id}
                >

                  <div>

                    <div className="requirement-id">

                      IMP-
                      {String(
                        analysis.id
                      ).padStart(3, "0")}

                    </div>


                    <h3>
                      {analysis.changeType}
                    </h3>


                    <p>
                      {analysis.summary}
                    </p>


                    <div
                      style={{
                        marginTop: "12px",
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >

                      <strong>
                        Requirement:
                      </strong>{" "}

                      {analysis.requirement?.title ||
                        requirements.find(
                          (r) =>
                            r.id ===
                            analysis.requirement?.id
                        )?.title ||
                        "User Authentication"}

                    </div>

                  </div>


                  <div className="requirement-right">

                    <span className="status">
                      ANALYZED
                    </span>


                    <button
                      className="view-button"
                      onClick={() =>
                        viewImpact(
                          analysis
                        )
                      }
                    >
                      View
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </>
  );


  // =========================================================
  // MAIN UI
  // =========================================================

  return (

    <div className="app">


      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            C
          </div>

          <span>
            CodeStory
          </span>

        </div>


        <nav>

          <button
            className={
              activePage === "Dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("Dashboard")
            }
          >
            Dashboard
          </button>


          <button
            className={
              activePage === "Requirements"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("Requirements")
            }
          >
            Requirements
          </button>


          <button
            className={
              activePage === "Engineering Decisions"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage(
                "Engineering Decisions"
              )
            }
          >
            Engineering Decisions
          </button>


          <button
            className={
              activePage === "Impact Analysis"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage(
                "Impact Analysis"
              )
            }
          >
            Impact Analysis
          </button>


          <button
            className={
              activePage === "Evolution Timeline"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage(
                "Evolution Timeline"
              )
            }
          >
            Evolution Timeline
          </button>


          <button
            className="nav-item"
            onClick={() =>
              alert(
                "Artefacts module is coming next."
              )
            }
          >
            Artefacts
          </button>

        </nav>

      </aside>


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="main-content">

        {activePage === "Dashboard" &&
          renderDashboard()}

        {activePage === "Requirements" &&
          renderRequirements()}

        {activePage === "Engineering Decisions" &&
          renderDecisions()}

        {activePage === "Impact Analysis" &&
          renderImpactAnalysis()}

        {activePage === "Evolution Timeline" &&
          renderEvolutionTimeline()}

      </main>


      {/* =====================================================
          CREATE REQUIREMENT MODAL
          ===================================================== */}

      {showForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h2>
                  Create New Requirement
                </h2>

                <p>
                  Add a new requirement to your project
                </p>

              </div>


              <button
                className="close-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>

            </div>


            <form
              className="requirement-form"
              onSubmit={createRequirement}
            >

              <label>
                Title
              </label>

              <input
                type="text"
                placeholder="Enter requirement title"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                required
              />


              <label>
                Description
              </label>

              <textarea
                rows="5"
                placeholder="Describe the requirement..."
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
              />


              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >

                <option value="ACTIVE">
                  ACTIVE
                </option>

                <option value="DRAFT">
                  DRAFT
                </option>

                <option value="COMPLETED">
                  COMPLETED
                </option>

                <option value="ARCHIVED">
                  ARCHIVED
                </option>

              </select>


              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary-button"
                  disabled={loading}
                >

                  {loading
                    ? "Creating..."
                    : "Create Requirement"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =====================================================
          CREATE VERSION MODAL
          ===================================================== */}

      {showVersionForm &&
        selectedRequirement && (

          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <div>

                  <h2>
                    Create New Version
                  </h2>

                  <p>
                    Create a new version for{" "}
                    {selectedRequirement.title}
                  </p>

                </div>


                <button
                  className="close-button"
                  onClick={() =>
                    setShowVersionForm(false)
                  }
                >
                  ×
                </button>

              </div>


              <form
                className="requirement-form"
                onSubmit={createVersion}
              >

                <label>
                  Version Title
                </label>

                <input
                  type="text"
                  value={versionTitle}
                  onChange={(event) =>
                    setVersionTitle(
                      event.target.value
                    )
                  }
                  required
                />


                <label>
                  Description
                </label>

                <textarea
                  rows="5"
                  value={versionDescription}
                  onChange={(event) =>
                    setVersionDescription(
                      event.target.value
                    )
                  }
                />


                <label>
                  Status
                </label>

                <select
                  value={versionStatus}
                  onChange={(event) =>
                    setVersionStatus(
                      event.target.value
                    )
                  }
                >

                  <option value="ACTIVE">
                    ACTIVE
                  </option>

                  <option value="DRAFT">
                    DRAFT
                  </option>

                  <option value="COMPLETED">
                    COMPLETED
                  </option>

                  <option value="ARCHIVED">
                    ARCHIVED
                  </option>

                </select>


                <div className="form-buttons">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() =>
                      setShowVersionForm(false)
                    }
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="primary-button"
                    disabled={versionLoading}
                  >

                    {versionLoading
                      ? "Creating..."
                      : "Create Version"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}


      {/* =====================================================
          REQUIREMENT DETAILS MODAL
          ===================================================== */}

      {selectedRequirement &&
        !showVersionForm &&
        !selectedVersion &&
        !comparisonData && (

          <div className="modal-overlay">

            <div className="details-modal">

              <div className="modal-header">

                <div>

                  <div className="requirement-id">

                    REQ-
                    {String(
                      selectedRequirement.id
                    ).padStart(3, "0")}

                  </div>


                  <h2>
                    {selectedRequirement.title}
                  </h2>


                  <p>
                    Requirement details and version information
                  </p>

                </div>


                <button
                  className="close-button"
                  onClick={
                    closeRequirementDetails
                  }
                >
                  ×
                </button>

              </div>


              <div className="details-content">

                <div className="detail-block">

                  <h3>
                    Description
                  </h3>

                  <p>
                    {selectedRequirement.description}
                  </p>

                </div>


                <div className="detail-block">

                  <h3>
                    Status
                  </h3>

                  <span className="status">
                    {selectedRequirement.status}
                  </span>

                </div>


                <div className="details-grid">

                  <div className="detail-block">

                    <h3>
                      Created
                    </h3>

                    <p>
                      {formatDate(
                        selectedRequirement.createdAt
                      )}
                    </p>

                  </div>


                  <div className="detail-block">

                    <h3>
                      Last Updated
                    </h3>

                    <p>
                      {formatDate(
                        selectedRequirement.updatedAt
                      )}
                    </p>

                  </div>

                </div>


                <div className="version-section">

                  <div className="version-header">

                    <div>

                      <h3>
                        Requirement Versions
                      </h3>

                      <p>
                        Track how this requirement evolves over time.
                      </p>

                    </div>


                    <button
                      className="secondary-button"
                      onClick={openVersionForm}
                    >
                      + New Version
                    </button>

                  </div>


                  {versions.length === 0 ? (

                    <div className="empty-state">
                      No versions found.
                    </div>

                  ) : (

                    versions.map(
                      (version, index) => (

                        <div
                          className="version-card"
                          key={version.id}
                          onClick={() =>
                            viewVersion(version)
                          }
                          style={{
                            cursor: "pointer",
                          }}
                        >

                          <div className="version-number">

                            V
                            {version.versionNumber}

                          </div>


                          <div className="version-info">

                            <strong>
                              {version.title}
                            </strong>


                            <p>
                              {version.description}
                            </p>


                            <small>

                              {version.status}

                              {" • "}

                              {formatDate(
                                version.createdAt
                              )}

                            </small>

                          </div>


                          {index === 0 && (

                            <span className="current-version">
                              CURRENT
                            </span>

                          )}

                        </div>

                      )
                    )

                  )}

                </div>

              </div>


              <div className="details-footer">

                <button
                  className="cancel-button"
                  onClick={
                    closeRequirementDetails
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}


      {/* =====================================================
          VERSION DETAILS MODAL
          ===================================================== */}

      {selectedVersion &&
        !comparisonData && (

          <div className="modal-overlay">

            <div className="details-modal">

              <div className="modal-header">

                <div>

                  <div className="requirement-id">

                    REQ-
                    {selectedVersion.requirement?.id
                      ? String(
                          selectedVersion.requirement.id
                        ).padStart(3, "0")
                      : "---"}

                  </div>


                  <h2>
                    Version Details
                  </h2>


                  <p>
                    Requirement version information
                  </p>

                </div>


                <button
                  className="close-button"
                  onClick={
                    closeVersionDetails
                  }
                >
                  ×
                </button>

              </div>


              <div className="details-content">

                <div className="detail-block">

                  <h3>
                    Version
                  </h3>


                  <div className="version-number">

                    V
                    {selectedVersion.versionNumber}

                  </div>

                </div>


                <div className="detail-block">

                  <h3>
                    Title
                  </h3>

                  <p>
                    {selectedVersion.title}
                  </p>

                </div>


                <div className="detail-block">

                  <h3>
                    Description
                  </h3>

                  <p>
                    {selectedVersion.description ||
                      "No description available."}
                  </p>

                </div>


                <div className="detail-block">

                  <h3>
                    Status
                  </h3>

                  <span className="status">
                    {selectedVersion.status}
                  </span>

                </div>


                <div className="detail-block">

                  <h3>
                    Created
                  </h3>

                  <p>
                    {formatDate(
                      selectedVersion.createdAt
                    )}
                  </p>

                </div>


                <div className="detail-block">

                  <h3>
                    Parent Requirement
                  </h3>

                  <p>
                    {selectedVersion.requirement?.title ||
                      "Not available"}
                  </p>

                </div>

              </div>


              <div className="details-footer">

                {selectedVersion.versionNumber > 1 && (

                  <button
                    className="primary-button"
                    onClick={compareWithPrevious}
                    disabled={comparisonLoading}
                  >

                    {comparisonLoading
                      ? "Comparing..."
                      : "Compare with Previous Version"}

                  </button>

                )}


                <button
                  className="cancel-button"
                  onClick={
                    closeVersionDetails
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}


      {/* =====================================================
          VERSION COMPARISON MODAL
          ===================================================== */}

      {comparisonData && (

        <div className="modal-overlay">

          <div className="details-modal">

            <div className="modal-header">

              <div>

                <div className="requirement-id">

                  REQ-
                  {String(
                    comparisonData.requirementId
                  ).padStart(3, "0")}

                </div>


                <h2>
                  Version Comparison
                </h2>


                <p>
                  {comparisonData.requirementTitle}
                </p>

              </div>


              <button
                className="close-button"
                onClick={closeComparison}
              >
                ×
              </button>

            </div>


            <div className="details-content">

              {comparisonLoading ? (

                <div className="empty-state">
                  Comparing versions...
                </div>

              ) : (

                <>

                  <div className="comparison-grid">

                    <div className="comparison-column">

                      <h3>
                        V
                        {comparisonData.version2?.versionNumber}
                      </h3>

                      <p>
                        Previous Version
                      </p>

                    </div>


                    <div className="comparison-column">

                      <h3>
                        V
                        {comparisonData.version1?.versionNumber}
                      </h3>

                      <p>
                        Current Version
                      </p>

                    </div>

                  </div>


                  <div className="comparison-section">

                    <h3>
                      Title
                    </h3>


                    <div className="comparison-grid">

                      <div className="comparison-value">

                        {comparisonData.version2?.title}

                      </div>


                      <div className="comparison-value">

                        {comparisonData.version1?.title}

                      </div>

                    </div>


                    <div
                      className={
                        comparisonData.changes?.titleChanged
                          ? "change-badge changed"
                          : "change-badge"
                      }
                    >

                      {comparisonData.changes?.titleChanged
                        ? "Changed"
                        : "No Change"}

                    </div>

                  </div>


                  <div className="comparison-section">

                    <h3>
                      Description
                    </h3>


                    <div className="comparison-grid">

                      <div className="comparison-value">

                        {comparisonData.version2?.description}

                      </div>


                      <div className="comparison-value">

                        {comparisonData.version1?.description}

                      </div>

                    </div>


                    <div
                      className={
                        comparisonData.changes?.descriptionChanged
                          ? "change-badge changed"
                          : "change-badge"
                      }
                    >

                      {comparisonData.changes?.descriptionChanged
                        ? "Changed"
                        : "No Change"}

                    </div>

                  </div>


                  <div className="comparison-section">

                    <h3>
                      Status
                    </h3>


                    <div className="comparison-grid">

                      <div className="comparison-value">

                        {comparisonData.version2?.status}

                      </div>


                      <div className="comparison-value">

                        {comparisonData.version1?.status}

                      </div>

                    </div>


                    <div
                      className={
                        comparisonData.changes?.statusChanged
                          ? "change-badge changed"
                          : "change-badge"
                      }
                    >

                      {comparisonData.changes?.statusChanged
                        ? "Changed"
                        : "No Change"}

                    </div>

                  </div>


                  <div className="comparison-summary">

                    <h3>
                      Changes Summary
                    </h3>


                    <p>

                      {comparisonData.hasChanges
                        ? "Changes were detected between these two requirement versions."
                        : "No changes were detected between these two requirement versions."}

                    </p>

                  </div>

                </>

              )}

            </div>


            <div className="details-footer">

              <button
                className="cancel-button"
                onClick={closeComparison}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          CREATE ENGINEERING DECISION MODAL
          ===================================================== */}

      {showDecisionForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h2>
                  Create Engineering Decision
                </h2>

                <p>
                  Record an important technical or architectural decision
                </p>

              </div>


              <button
                className="close-button"
                onClick={() =>
                  setShowDecisionForm(false)
                }
              >
                ×
              </button>

            </div>


            <form
              className="requirement-form"
              onSubmit={createDecision}
            >

              <label>
                Related Requirement
              </label>


              <select
                value={decisionRequirementId}
                onChange={(event) =>
                  setDecisionRequirementId(
                    event.target.value
                  )
                }
                required
              >

                <option value="">
                  Select Requirement
                </option>


                {requirements.map(
                  (requirement) => (

                    <option
                      key={requirement.id}
                      value={requirement.id}
                    >

                      REQ-
                      {String(
                        requirement.id
                      ).padStart(3, "0")}

                      {" — "}

                      {requirement.title}

                    </option>

                  )
                )}

              </select>


              <label>
                Decision Title
              </label>


              <input
                type="text"
                placeholder="Example: Use Multi-Factor Authentication"
                value={decisionTitle}
                onChange={(event) =>
                  setDecisionTitle(
                    event.target.value
                  )
                }
                required
              />


              <label>
                Decision Type
              </label>


              <select
                value={decisionType}
                onChange={(event) =>
                  setDecisionType(
                    event.target.value
                  )
                }
              >

                <option value="ARCHITECTURE">
                  ARCHITECTURE
                </option>

                <option value="SECURITY">
                  SECURITY
                </option>

                <option value="DATABASE">
                  DATABASE
                </option>

                <option value="API">
                  API
                </option>

                <option value="PERFORMANCE">
                  PERFORMANCE
                </option>

                <option value="DESIGN">
                  DESIGN
                </option>

                <option value="OTHER">
                  OTHER
                </option>

              </select>


              <label>
                Rationale
              </label>


              <textarea
                rows="5"
                placeholder="Why was this decision made?"
                value={decisionRationale}
                onChange={(event) =>
                  setDecisionRationale(
                    event.target.value
                  )
                }
              />


              <label>
                Implementation / Artefact Reference
              </label>


              <input
                type="text"
                placeholder="Example: Authentication module"
                value={implementationReference}
                onChange={(event) =>
                  setImplementationReference(
                    event.target.value
                  )
                }
              />


              <label>
                Supporting Evidence
              </label>


              <textarea
                rows="4"
                placeholder="Supporting requirement, document, issue, or other evidence"
                value={supportingEvidence}
                onChange={(event) =>
                  setSupportingEvidence(
                    event.target.value
                  )
                }
              />


              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowDecisionForm(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary-button"
                  disabled={decisionLoading}
                >

                  {decisionLoading
                    ? "Creating..."
                    : "Create Decision"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =====================================================
          ENGINEERING DECISION DETAILS
          ===================================================== */}

      {selectedDecision && (

        <div className="modal-overlay">

          <div className="details-modal">

            <div className="modal-header">

              <div>

                <div className="requirement-id">

                  DEC-
                  {String(
                    selectedDecision.id
                  ).padStart(3, "0")}

                </div>


                <h2>
                  Engineering Decision
                </h2>


                <p>
                  Decision information and traceability
                </p>

              </div>


              <button
                className="close-button"
                onClick={closeDecision}
              >
                ×
              </button>

            </div>


            <div className="details-content">

              <div className="detail-block">

                <h3>
                  Decision Title
                </h3>

                <p>
                  {selectedDecision.title}
                </p>

              </div>


              <div className="detail-block">

                <h3>
                  Type
                </h3>

                <span className="status">
                  {selectedDecision.type}
                </span>

              </div>


              <div className="detail-block">

                <h3>
                  Rationale
                </h3>

                <p>
                  {selectedDecision.rationale ||
                    "No rationale provided."}
                </p>

              </div>


              <div className="detail-block">

                <h3>
                  Implementation / Artefact Reference
                </h3>

                <p>
                  {selectedDecision.implementationReference ||
                    "No implementation reference provided."}
                </p>

              </div>


              <div className="detail-block">

                <h3>
                  Supporting Evidence
                </h3>

                <p>
                  {selectedDecision.supportingEvidence ||
                    "No supporting evidence provided."}
                </p>

              </div>


              <div className="detail-block">

                <h3>
                  Related Requirement
                </h3>

                <p>

                  REQ-
                  {selectedDecision.requirement?.id
                    ? String(
                        selectedDecision.requirement.id
                      ).padStart(3, "0")
                    : "---"}

                  {" — "}

                  {selectedDecision.requirement?.title ||
                    "Unknown"}

                </p>

              </div>


              <div className="detail-block">

                <h3>
                  Created
                </h3>

                <p>
                  {formatDate(
                    selectedDecision.createdAt
                  )}
                </p>

              </div>

            </div>


            <div className="details-footer">

              <button
                className="cancel-button"
                onClick={closeDecision}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          CREATE IMPACT ANALYSIS MODAL
          ===================================================== */}

      {showImpactForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h2>
                  Create Impact Analysis
                </h2>

                <p>
                  Analyze the possible consequences of a requirement change
                </p>

              </div>


              <button
                className="close-button"
                onClick={() =>
                  setShowImpactForm(false)
                }
              >
                ×
              </button>

            </div>


            <form
              className="requirement-form"
              onSubmit={createImpactAnalysis}
            >

              <label>
                Related Requirement
              </label>


              <select
                value={impactRequirementId}
                onChange={(event) =>
                  setImpactRequirementId(
                    event.target.value
                  )
                }
                required
              >

                <option value="">
                  Select Requirement
                </option>


                {requirements.map(
                  (requirement) => (

                    <option
                      key={requirement.id}
                      value={requirement.id}
                    >

                      REQ-
                      {String(
                        requirement.id
                      ).padStart(3, "0")}

                      {" — "}

                      {requirement.title}

                    </option>

                  )
                )}

              </select>


              <label>
                Change Type
              </label>


              <select
                value={changeType}
                onChange={(event) =>
                  setChangeType(
                    event.target.value
                  )
                }
              >

                <option value="REQUIREMENT_CHANGE">
                  REQUIREMENT CHANGE
                </option>

                <option value="TITLE_CHANGE">
                  TITLE CHANGE
                </option>

                <option value="DESCRIPTION_CHANGE">
                  DESCRIPTION CHANGE
                </option>

                <option value="VERSION_CHANGE">
                  VERSION CHANGE
                </option>

                <option value="SECURITY_CHANGE">
                  SECURITY CHANGE
                </option>

                <option value="FUNCTIONAL_CHANGE">
                  FUNCTIONAL CHANGE
                </option>

                <option value="OTHER">
                  OTHER
                </option>

              </select>


              <label>
                Impact Summary
              </label>


              <textarea
                rows="5"
                placeholder="Describe the expected impact of this change..."
                value={impactSummary}
                onChange={(event) =>
                  setImpactSummary(
                    event.target.value
                  )
                }
                required
              />


              <label>
                Affected Modules
              </label>


              <textarea
                rows="3"
                placeholder="Example: Authentication Module, Security Module"
                value={affectedModules}
                onChange={(event) =>
                  setAffectedModules(
                    event.target.value
                  )
                }
              />


              <label>
                Affected Source Files
              </label>


              <textarea
                rows="3"
                placeholder="Example: AuthenticationService.java, LoginController.java"
                value={affectedSourceFiles}
                onChange={(event) =>
                  setAffectedSourceFiles(
                    event.target.value
                  )
                }
              />


              <label>
                Affected APIs
              </label>


              <textarea
                rows="3"
                placeholder="Example: POST /api/login, POST /api/authenticate"
                value={affectedApis}
                onChange={(event) =>
                  setAffectedApis(
                    event.target.value
                  )
                }
              />


              <label>
                Affected Functionalities
              </label>


              <textarea
                rows="3"
                placeholder="Example: User Login, Multi-Factor Authentication"
                value={affectedFunctionalities}
                onChange={(event) =>
                  setAffectedFunctionalities(
                    event.target.value
                  )
                }
              />


              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowImpactForm(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary-button"
                  disabled={impactLoading}
                >

                  {impactLoading
                    ? "Analyzing..."
                    : "Analyze Impact"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =====================================================
          IMPACT ANALYSIS DETAILS MODAL
          ===================================================== */}

      {selectedImpact && (

        <div className="modal-overlay">

          <div className="details-modal">

            <div className="modal-header">

              <div>

                <div className="requirement-id">

                  IMP-
                  {String(
                    selectedImpact.id
                  ).padStart(3, "0")}

                </div>


                <h2>
                  Impact Analysis
                </h2>


                <p>
                  Requirement change impact information
                </p>

              </div>


              <button
                className="close-button"
                onClick={closeImpact}
              >
                ×
              </button>

            </div>


            <div className="details-content">


              <div className="detail-block">

                <h3>
                  Related Requirement
                </h3>

                <p>

                  REQ-
                  {selectedImpact.requirement?.id
                    ? String(
                        selectedImpact.requirement.id
                      ).padStart(3, "0")
                    : "---"}

                  {" — "}

                  {selectedImpact.requirement?.title ||
                    requirements.find(
                      (requirement) =>
                        requirement.id ===
                        selectedImpact.requirement?.id
                    )?.title ||
                    "User Authentication"}

                </p>

              </div>


              <div className="detail-block">

                <h3>
                  Change Type
                </h3>

                <span className="status">
                  {selectedImpact.changeType}
                </span>

              </div>


              <div className="detail-block">

                <h3>
                  Impact Summary
                </h3>

                <p>
                  {selectedImpact.summary ||
                    "No summary available."}
                </p>

              </div>


              <div className="detail-block">

                <h3>
                  Affected Modules
                </h3>

                <p>
                  {selectedImpact.affectedModules ||
                    "No affected modules recorded."}
                </p>

              </div>


              <div className="detail-block">

                <h3>
                  Affected Source Files
                </h3>

                <p>
                  {selectedImpact.affectedSourceFiles ||
                    "No affected source files recorded."}
                </p>

              </div>


              <div className="detail-block">

                <h3>
                  Affected APIs
                </h3>

                <p>
                  {selectedImpact.affectedApis ||
                    "No affected APIs recorded."}
                </p>

              </div>


              <div className="detail-block">

                <h3>
                  Affected Functionalities
                </h3>

                <p>
                  {selectedImpact.affectedFunctionalities ||
                    "No affected functionalities recorded."}
                </p>

              </div>


              <div className="detail-block">

                <h3>
                  Analyzed At
                </h3>

                <p>
                  {formatDate(
                    selectedImpact.analyzedAt
                  )}
                </p>

              </div>


            </div>


            <div className="details-footer">

              <button
                className="cancel-button"
                onClick={closeImpact}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default App;