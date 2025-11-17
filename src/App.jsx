import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


const CLIENTS = [
  { id: "c1", name: "Collabera - Collabera Inc", reqs: ["r1", "r2"] },
  { id: "c2", name: "Acme Corp", reqs: ["r3"] },
];

const REQS = {
  r1: {
    id: "OWNAI_234",
    title: "Application Development",
    talents: [
      { id: "t1", name: "Monika Goyal Test", stage: "moved" },
      { id: "t2", name: "shaili khatri", stage: "moved" },
      { id: "t3", name: "Mehul Patel", stage: "screening" },
    ],
  },
  r2: {
    id: "CLK_12880",
    title: "Business Administrator",
    talents: [
      { id: "t4", name: "Amit Kumar", stage: "moved" },
      { id: "t5", name: "Priya Singh", stage: "moved" },
    ],
  },
  r3: {
    id: "REQ_3001",
    title: "QA Engineer",
    talents: [
      { id: "t6", name: "Ravi Sharma", stage: "moved" },
    ],
  },
};

const CURRENCIES = ["USD - Dollars ($)", "INR - Rupees (₹)"];


export default function App() {

  const [clientId, setClientId] = useState("");
  const [poType, setPoType] = useState(""); 
  const [poNumber, setPoNumber] = useState("");
  const [receivedOn, setReceivedOn] = useState("");
  const [receivedFromName, setReceivedFromName] = useState("");
  const [receivedFromEmail, setReceivedFromEmail] = useState("");
  const [poStartDate, setPoStartDate] = useState("");
  const [poEndDate, setPoEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState(CURRENCIES[0]);

 
  const initialJob = () => ({
    id: Date.now() + Math.floor(Math.random() * 1000),
    reqKey: "",
    reqId: "",
    talents: [], 
  });
  const [jobs, setJobs] = useState([initialJob()]);

  const [readOnly, setReadOnly] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setJobs([initialJob()]);
  }, [clientId]);

  const getClientName = (id) => CLIENTS.find(c => c.id === id)?.name || "";
  const getReqOptions = () => {
    if (!clientId) return [];
    const client = CLIENTS.find(c => c.id === clientId);
    return (client?.reqs || []).map(rk => ({ key: rk, ...REQS[rk] }));
  };

  const addJob = () => setJobs(prev => [...prev, initialJob()]);
  const removeJob = (jobId) => setJobs(prev => prev.filter(j => j.id !== jobId));

  const updateJobReq = (jobId, reqKey) => {
    const reqObj = REQS[reqKey];
    setJobs(prev => prev.map(job => job.id === jobId ? { ...job, reqKey, reqId: reqObj?.id || "", talents: [] } : job));
  };

  const addTalent = (jobId, fromReqTalentId = null) => {
    const totalTalents = jobs.reduce((a, j) => a + j.talents.length, 0);
    if (poType === "Individual" && totalTalents >= 1) return;

    const newTalent = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      sourceId: fromReqTalentId || null, // id of REQ talent if chosen
      name: fromReqTalentId ? (Object.values(REQS).flatMap(r => r.talents).find(t => t.id === fromReqTalentId)?.name || "") : "",
      contractDuration: "",
      billRate: "",
      currency: currency,
      standardBR: "",
      standardCurrency: currency,
      overtimeBR: "",
      overtimeCurrency: currency,
      manual: fromReqTalentId ? false : true,
    };
    setJobs(prev => prev.map(job => job.id === jobId ? { ...job, talents: [...job.talents, newTalent] } : job));
  };

  const removeTalent = (jobId, talentId) => {
    setJobs(prev => prev.map(job => job.id === jobId ? { ...job, talents: job.talents.filter(t => t.id !== talentId) } : job));
  };

  const updateTalentField = (jobId, talentId, field, value) => {
    setJobs(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      return {
        ...job,
        talents: job.talents.map(t => t.id === talentId ? { ...t, [field]: value } : t)
      };
    }));
  };

  const availableTalentsForJob = (reqKey) => {
    if (!reqKey) return [];
    return (REQS[reqKey]?.talents || []).filter(t => t.stage === "moved");
  };

  // Reset
  const resetForm = () => {
    setClientId("");
    setPoType("");
    setPoNumber("");
    setReceivedOn("");
    setReceivedFromName("");
    setReceivedFromEmail("");
    setPoStartDate("");
    setPoEndDate("");
    setBudget("");
    setCurrency(CURRENCIES[0]);
    setJobs([initialJob()]);
    setReadOnly(false);
    setErrors({});
  };

  // Validation
  const validate = () => {
    const err = {};
    if (!clientId) err.clientId = "Client is required.";
    if (!poType) err.poType = "Purchase Order Type is required.";
    if (!poNumber) err.poNumber = "PO Number is required.";
    if (!receivedOn) err.receivedOn = "Received On date is required.";
    if (!receivedFromName) err.receivedFromName = "Received From name is required.";
    if (!receivedFromEmail) err.receivedFromEmail = "Received From email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(receivedFromEmail)) err.receivedFromEmail = "Enter a valid email.";
    if (!poStartDate) err.poStartDate = "PO Start Date is required.";
    if (!poEndDate) err.poEndDate = "PO End Date is required.";
    if (poStartDate && poEndDate && new Date(poEndDate) < new Date(poStartDate)) {
      err.poEndDate = "End date cannot be before start date.";
    }
    if (!budget) err.budget = "Budget is required.";
    else if (!/^\d{1,5}$/.test(budget)) err.budget = "Enter numeric budget up to 5 digits.";

    // jobs & talents validation
    if (!jobs.length) err.jobs = "At least one job is required.";
    jobs.forEach((job, jIdx) => {
      if (!job.reqKey) err[`job_${jIdx}`] = "Select Job/REQ for this job.";
      // Each talent required fields
      job.talents.forEach((t, tIdx) => {
        if (!t.name || !t.name.trim()) err[`job_${jIdx}_talent_${tIdx}_name`] = "Talent name is required.";
        if (!t.contractDuration) err[`job_${jIdx}_talent_${tIdx}_duration`] = "Contract duration required.";
        if (!t.billRate) err[`job_${jIdx}_talent_${tIdx}_billRate`] = "Bill rate required.";
        // standard/overtime are optional but we can require them if you want - currently optional
      });
    });

    // Talent counts by PO type
    const totalSelected = jobs.reduce((acc, job) => acc + job.talents.length, 0);
    if (poType === "Individual") {
      if (totalSelected === 0) err.individual = "Individual PO requires exactly one talent.";
      if (totalSelected > 1) err.individual = "Individual PO allows only one talent.";
    }
    if (poType === "Group") {
      if (totalSelected < 2) err.group = "Group PO requires at least two talents selected.";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const out = {
      clientId,
      clientName: getClientName(clientId),
      poType,
      poNumber,
      receivedOn,
      receivedFromName,
      receivedFromEmail,
      poStartDate,
      poEndDate,
      budget,
      currency,
      jobs: jobs.map(job => ({
        reqKey: job.reqKey,
        reqId: job.reqId,
        talents: job.talents.map(t => ({
          sourceId: t.sourceId,
          name: t.name,
          contractDuration: t.contractDuration,
          billRate: t.billRate,
          currency: t.currency,
          standardBR: t.standardBR,
          standardCurrency: t.standardCurrency,
          overtimeBR: t.overtimeBR,
          overtimeCurrency: t.overtimeCurrency,
        }))
      }))
    };

    console.log("Form submitted:", out);
    setReadOnly(true);
  };

  // UI helpers
  const renderError = (key) => errors[key] ? <div className="text-danger small mt-1">{errors[key]}</div> : null;
  const totalTalentsCount = jobs.reduce((a, j) => a + j.talents.length, 0);

  return (
    <div className="container py-4">

      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-primary text-white rounded-top-4 d-flex justify-content-between align-items-center py-3 px-4">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-file-earmark-text me-2"></i>
            Purchase Order
          </h5>

          <div>
            <button
              className="btn btn-light me-2 fw-bold"
              type="button"
              onClick={resetForm}
              disabled={readOnly}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Reset
            </button>

            <button
              className="btn btn-success fw-bold"
              type="button"
              onClick={handleSubmit}
              disabled={readOnly}
            >
              <i className="bi bi-save me-1"></i> Save
            </button>
          </div>
        </div>

        <form className="card-body px-4 py-4" onSubmit={handleSubmit}>

          {/* --- PURCHASE ORDER DETAILS --- */}
          <h4 className="fw-bold mb-3">
            <i className="bi bi-card-list me-2 text-primary"></i>
            Purchase Order Details
          </h4>

          <div className="row g-4">

            {/* Client Name */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Client Name *</label>
              {!readOnly ? (
                <select className="form-select rounded-3 shadow-sm" value={clientId} onChange={e => setClientId(e.target.value)}>
                  <option value="">Select client</option>
                  {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              ) : <input className="form-control-plaintext" readOnly value={getClientName(clientId)} />}
              {renderError("clientId")}
            </div>

            {/* PO Type */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Purchase Order Type *</label>
              {!readOnly ? (
                <select className="form-select rounded-3 shadow-sm" value={poType} onChange={e => setPoType(e.target.value)}>
                  <option value="">Select PO Type</option>
                  <option value="Group">Group PO</option>
                  <option value="Individual">Individual PO</option>
                </select>
              ) : <input className="form-control-plaintext" readOnly value={poType} />}
              {renderError("poType")}
            </div>

            {/* PO Number */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Purchase Order No. *</label>
              {!readOnly ? (
                <input className="form-control rounded-3 shadow-sm" value={poNumber} onChange={e => setPoNumber(e.target.value)} placeholder="PO Number" />
              ) : <input className="form-control-plaintext" readOnly value={poNumber} />}
              {renderError("poNumber")}
            </div>

            {/* Received On */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">Received On *</label>
              {!readOnly ? (
                <input className="form-control rounded-3 shadow-sm" type="date" value={receivedOn} onChange={e => setReceivedOn(e.target.value)} />
              ) : <input className="form-control-plaintext" readOnly value={receivedOn} />}
              {renderError("receivedOn")}
            </div>

            {/* Received From Name */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">Received From Name *</label>
              {!readOnly ? (
                <input className="form-control rounded-3 shadow-sm" value={receivedFromName} onChange={e => setReceivedFromName(e.target.value)} placeholder="Received From Name" />
              ) : <input className="form-control-plaintext" readOnly value={receivedFromName} />}
              {renderError("receivedFromName")}
            </div>

            {/* Received From Email */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">Received From Email *</label>
              {!readOnly ? (
                <input className="form-control rounded-3 shadow-sm" value={receivedFromEmail} onChange={e => setReceivedFromEmail(e.target.value)} placeholder="Email ID" />
              ) : <input className="form-control-plaintext" readOnly value={receivedFromEmail} />}
              {renderError("receivedFromEmail")}
            </div>

            {/* Start Date */}
            <div className="col-md-3"></div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">PO Start Date *</label>
              {!readOnly ? (
                <input className="form-control rounded-3 shadow-sm" type="date" value={poStartDate} onChange={e => setPoStartDate(e.target.value)} />
              ) : <input className="form-control-plaintext" readOnly value={poStartDate} />}
              {renderError("poStartDate")}
            </div>

            {/* End Date */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">PO End Date *</label>
              {!readOnly ? (
                <input className="form-control rounded-3 shadow-sm" type="date" value={poEndDate} onChange={e => setPoEndDate(e.target.value)} min={poStartDate || undefined} />
              ) : <input className="form-control-plaintext" readOnly value={poEndDate} />}
              {renderError("poEndDate")}
            </div>

            {/* Budget */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">Budget *</label>
              {!readOnly ? (
                <input className="form-control rounded-3 shadow-sm" value={budget} onChange={e => setBudget(e.target.value.replace(/\D/g, ""))} placeholder="Budget" maxLength={5} />
              ) : <input className="form-control-plaintext" readOnly value={budget} />}
              {renderError("budget")}
            </div>

            {/* Currency */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">Currency *</label>
              {!readOnly ? (
                <select className="form-select rounded-3 shadow-sm" value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : <input className="form-control-plaintext" readOnly value={currency} />}
            </div>
          </div>

          {/* ---------------- JOBS & TALENTS ---------------- */}
          <hr className="my-5" />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold">
              <i className="bi bi-people-fill text-primary me-2"></i>
              Jobs & Talents
            </h4>

            {!readOnly && (
              <button className="btn btn-outline-primary rounded-pill px-4 fw-bold" type="button" onClick={addJob}>
                <i className="bi bi-plus-circle me-1"></i> Add Job
              </button>
            )}
          </div>

          {jobs.map((job, jIdx) => (
            <div className="card mb-4 shadow-sm border-0 rounded-4 p-3" key={job.id}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold">
                  <i className="bi bi-briefcase-fill text-secondary me-2"></i>
                  Job #{jIdx + 1}
                </h5>

                {!readOnly && jobs.length > 1 && (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeJob(job.id)}>
                    <i className="bi bi-trash3"></i> Remove Job
                  </button>
                )}
              </div>

              {/* Job Select */}
              <div className="row mb-4">
                <div className="col-md-8">
                  {!readOnly ? (
                    <select className="form-select rounded-3 shadow-sm" value={job.reqKey} onChange={e => updateJobReq(job.id, e.target.value)}>
                      <option value="">Select Job Title / REQ</option>
                      {getReqOptions().map(r => (
                        <option key={r.key} value={r.key}>{r.title}</option>
                      ))}
                    </select>
                  ) : (
                    <input className="form-control-plaintext" readOnly value={REQS[job.reqKey]?.title || ""} />
                  )}
                </div>

                <div className="col-md-4">
                  <input className="form-control shadow-sm rounded-3" readOnly value={REQS[job.reqKey]?.id || "REQ ID"} />
                </div>
              </div>

              {/* Talents */}
              <div>
                {job.talents.map((t, tIdx) => (
                  <div className="p-3 mb-3 rounded-4 border bg-light" key={t.id}>
                    <div className="d-flex justify-content-between">
                      <strong><i className="bi bi-person-bounding-box me-2"></i>Talent #{tIdx + 1}</strong>

                      {!readOnly && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeTalent(job.id, t.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>

                    <div className="row g-3 mt-2">

                      {/* NAME */}
                      <div className="col-md-3">
                        <label className="form-label small fw-bold">Name</label>

                        {!readOnly ? (
                          t.manual ? (
                            <input className="form-control form-control-sm rounded-3 shadow-sm" value={t.name}
                              onChange={e => updateTalentField(job.id, t.id, "name", e.target.value)} />
                          ) : (
                            <select className="form-select form-select-sm rounded-3 shadow-sm"
                              value={t.sourceId || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "manual") {
                                  updateTalentField(job.id, t.id, "manual", true);
                                  updateTalentField(job.id, t.id, "name", "");
                                } else {
                                  updateTalentField(job.id, t.id, "manual", false);
                                  updateTalentField(job.id, t.id, "sourceId", val);
                                  updateTalentField(job.id, t.id, "name",
                                    availableTalentsForJob(job.reqKey).find(a => a.id === val)?.name || ""
                                  );
                                }
                              }}>
                              <option value="">Select Talent</option>
                              {availableTalentsForJob(job.reqKey).map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                              ))}
                              <option value="manual">Other (Manual)</option>
                            </select>
                          )
                        ) : (
                          <input className="form-control-plaintext" readOnly value={t.name} />
                        )}

                        {renderError(`job_${jIdx}_talent_${tIdx}_name`)}
                      </div>

                      {/* CONTRACT DURATION */}
                      <div className="col-md-2">
                        <label className="form-label small fw-bold">Duration (Months)</label>
                        {!readOnly ? (
                          <input className="form-control form-control-sm rounded-3 shadow-sm"
                            value={t.contractDuration}
                            onChange={e => updateTalentField(job.id, t.id, "contractDuration", e.target.value)} />
                        ) : <input className="form-control-plaintext" readOnly value={t.contractDuration} />}
                        {renderError(`job_${jIdx}_talent_${tIdx}_duration`)}
                      </div>

                      {/* BILL RATE */}
                      <div className="col-md-2">
                        <label className="form-label small fw-bold">Bill Rate</label>
                        {!readOnly ? (
                          <input className="form-control form-control-sm rounded-3 shadow-sm"
                            value={t.billRate}
                            onChange={e => updateTalentField(job.id, t.id, "billRate", e.target.value.replace(/[^\d]/g, ""))} />
                        ) : <input className="form-control-plaintext" readOnly value={t.billRate} />}
                        {renderError(`job_${jIdx}_talent_${tIdx}_billRate`)}
                      </div>

                      <div className="col-md-2">
                        <label className="form-label small fw-bold">Currency</label>
                        {!readOnly ? (
                          <select className="form-select form-select-sm rounded-3 shadow-sm"
                            value={t.currency}
                            onChange={e => updateTalentField(job.id, t.id, "currency", e.target.value)}>
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        ) : <input className="form-control-plaintext" readOnly value={t.currency} />}
                      </div>

                      {/* STANDARD BR */}
                      <div className="col-md-2">
                        <label className="form-label small fw-bold">Std BR (/hr)</label>
                        {!readOnly ? (
                          <input className="form-control form-control-sm rounded-3 shadow-sm"
                            value={t.standardBR}
                            onChange={e => updateTalentField(job.id, t.id, "standardBR", e.target.value.replace(/[^\d]/g, ""))} />
                        ) : <input className="form-control-plaintext" readOnly value={t.standardBR} />}
                      </div>

                      <div className="col-md-2">
                        <label className="form-label small fw-bold">Std Currency</label>
                        {!readOnly ? (
                          <select className="form-select form-select-sm rounded-3 shadow-sm"
                            value={t.standardCurrency}
                            onChange={e => updateTalentField(job.id, t.id, "standardCurrency", e.target.value)}>
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        ) : <input className="form-control-plaintext" readOnly value={t.standardCurrency} />}
                      </div>

                      {/* OVERTIME BR */}
                      <div className="col-md-2">
                        <label className="form-label small fw-bold">OT BR</label>
                        {!readOnly ? (
                          <input className="form-control form-control-sm rounded-3 shadow-sm"
                            value={t.overtimeBR}
                            onChange={e => updateTalentField(job.id, t.id, "overtimeBR", e.target.value.replace(/[^\d]/g, ""))} />
                        ) : <input className="form-control-plaintext" readOnly value={t.overtimeBR} />}
                      </div>

                      <div className="col-md-2">
                        <label className="form-label small fw-bold">OT Currency</label>
                        {!readOnly ? (
                          <select className="form-select form-select-sm rounded-3 shadow-sm"
                            value={t.overtimeCurrency}
                            onChange={e => updateTalentField(job.id, t.id, "overtimeCurrency", e.target.value)}>
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        ) : <input className="form-control-plaintext" readOnly value={t.overtimeCurrency} />}
                      </div>

                    </div>
                  </div>
                ))}

                {/* ADD TALENT BUTTONS */}
                {!readOnly && (
                  <div className="d-flex justify-content-start mt-3">
                    <button
                      className="btn btn-outline-primary rounded-pill px-4 fw-bold me-3"
                      type="button"
                      onClick={() => addTalent(job.id, null)}
                    >
                      <i className="bi bi-person-plus me-1"></i>
                      Add Manual Talent
                    </button>

                    <button
                      className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                      type="button"
                      onClick={() => {
                        const available = availableTalentsForJob(job.reqKey);
                        if (available.length > 0) addTalent(job.id, available[0].id);
                      }}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Add REQ Talent
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}

          {/* Validation */}
          {renderError("individual")}
          {renderError("group")}
          {renderError("jobs")}

          <div className="mt-4 text-center">
            {!readOnly && (
              <button className="btn btn-success btn-lg rounded-pill px-5 fw-bold" type="submit">
                <i className="bi bi-check-circle-fill me-2"></i>
                Submit
              </button>
            )}

            {readOnly && (
              <div className="alert alert-secondary rounded-3 mt-3 text-center">
                <i className="bi bi-check2-circle me-2"></i>
                Form Saved – Read-only Mode Enabled
              </div>
            )}
          </div>

        </form>
      </div>

    </div>
  );
}