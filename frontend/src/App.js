import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";
import React from "react";

const API = "https://baggage-tracker-backend.onrender.com/api/bags";

export default function App() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [bags, setBags] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    tagNumber: "",
    passengerName: "",
    flightNumber: "",
    gate: "",
    belt: "",
    destination: "",
  });

  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusClass = (status) => {
    if (status === "Checked In") return "badge badgeChecked";
    if (status === "Loaded") return "badge badgeLoaded";
    if (status === "In Transit") return "badge badgeTransit";
    return "badge badgeDelivered";
  };

  const loadBags = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setBags(res.data);
      setError("");
    } catch (err) {
      setError("Could not load bags. Is the backend running on port 5050?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBags();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addBag = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await axios.post(API, form);
      setForm({
        tagNumber: "",
        passengerName: "",
        flightNumber: "",
        gate: "",
        belt: "",
        destination: "",
      });
      loadBags();
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        "Could not add bag. Try a different tag number.";
      setError(msg);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setError("");
      await axios.put(`${API}/${id}`, { status });
      loadBags();
    } catch (err) {
      setError("Could not update status. Try again.");
    }
  };

  const deleteBag = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this bag?");
    if (!ok) return;

    try {
      setError("");
      await axios.delete(`${API}/${id}`);
      loadBags();
    } catch (err) {
      setError("Could not delete bag.");
    }
  };

  const startEdit = (bag) => {
    setEditingId(bag._id);
    setForm({
      tagNumber: bag.tagNumber || "",
      passengerName: bag.passengerName || "",
      flightNumber: bag.flightNumber || "",
      gate: bag.gate || "",
      belt: bag.belt || "",
      destination: bag.destination || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      tagNumber: "",
      passengerName: "",
      flightNumber: "",
      gate: "",
      belt: "",
      destination: "",
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await axios.put(`${API}/${editingId}`, {
        passengerName: form.passengerName,
        flightNumber: form.flightNumber,
        gate: form.gate,
        belt: form.belt,
        destination: form.destination,
      });
      cancelEdit();
      loadBags();
    } catch (err) {
      setError("Could not save changes. Try again.");
    }
  };

  const filteredBags = useMemo(() => {
    return bags
      .filter((b) =>
        (b.tagNumber || "").toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [bags, search]);

  const stats = useMemo(() => {
    const counts = {
      total: bags.length,
      checkedIn: 0,
      loaded: 0,
      inTransit: 0,
      delivered: 0,
    };

    for (const b of bags) {
      if (b.status === "Checked In") counts.checkedIn += 1;
      else if (b.status === "Loaded") counts.loaded += 1;
      else if (b.status === "In Transit") counts.inTransit += 1;
      else if (b.status === "Delivered") counts.delivered += 1;
    }

    return counts;
  }, [bags]);

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <h1>AA Ops — Baggage Tracker</h1>
          <p>Mock internal tool • React + Node + MongoDB</p>

          <div className="role-badge">
            <div className="role-title">Role: Ramp Agent - CLT</div>
            <div className="role-shift">Shift: PM Ops</div>
          </div>
        </div>
      </div>

      <div className="row" style={{ marginBottom: 14 }}>
        <div className="card statCard">
          <div className="statLabel">Total Bags</div>
          <div className="statValue">{stats.total}</div>
        </div>

        <div className="card statCard">
          <div className="statLabel">Checked In</div>
          <div className="statValue">{stats.checkedIn}</div>
        </div>

        <div className="card statCard">
          <div className="statLabel">Loaded</div>
          <div className="statValue">{stats.loaded}</div>
        </div>

        <div className="card statCard">
          <div className="statLabel">In Transit</div>
          <div className="statValue">{stats.inTransit}</div>
        </div>

        <div className="card statCard">
          <div className="statLabel">Delivered</div>
          <div className="statValue">{stats.delivered}</div>
        </div>
      </div>

      <div className="card">
        {error && <div className="alert">{error}</div>}
        {loading && (
          <p style={{ marginTop: 0, color: "#a9b4cc" }}>Loading bags...</p>
        )}

        <div className="row" style={{ marginBottom: 10 }}>
          <input
            className="input"
            placeholder="Search tag (ex: AA123456)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 260 }}
          />
        </div>

        <form
          className="row"
          onSubmit={editingId ? saveEdit : addBag}
          style={{ marginBottom: 12 }}
        >
          <input
            className="input"
            name="tagNumber"
            placeholder="Tag Number"
            value={form.tagNumber}
            onChange={handleChange}
            required
            disabled={!!editingId}
          />

          <input
            className="input"
            name="passengerName"
            placeholder="Passenger Name"
            value={form.passengerName}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            name="flightNumber"
            placeholder="Flight Number"
            value={form.flightNumber}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            name="gate"
            placeholder="Gate (ex: C12)"
            value={form.gate}
            onChange={handleChange}
          />

          <input
            className="input"
            name="belt"
            placeholder="Belt/Carousel (ex: 7)"
            value={form.belt}
            onChange={handleChange}
          />

          <input
            className="input"
            name="destination"
            placeholder="Destination (ex: JFK)"
            value={form.destination}
            onChange={handleChange}
          />

          <button className="button" type="submit">
            {editingId ? "Save Changes" : "Add Bag"}
          </button>

          {editingId && (
            <button className="buttonDanger" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </form>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Tag</th>
                <th>Passenger</th>
                <th>Flight</th>
                <th>Gate</th>
                <th>Belt</th>
                <th>Dest</th>
                <th>Status</th>
                <th>Update</th>
                <th>Last Updated</th>
                <th className="actionsCol">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBags.map((bag) => (
                <tr key={bag._id}>
                  <td>{bag.tagNumber}</td>
                  <td>{bag.passengerName}</td>
                  <td>{bag.flightNumber}</td>
                  <td>{bag.gate || "-"}</td>
                  <td>{bag.belt || "-"}</td>
                  <td>{bag.destination || "-"}</td>

                  <td>
                    <span className={statusClass(bag.status)}>{bag.status}</span>
                  </td>

                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <select
                        className="select"
                        value={bag.status}
                        onChange={(e) => updateStatus(bag._id, e.target.value)}
                      >
                        <option>Checked In</option>
                        <option>Loaded</option>
                        <option>In Transit</option>
                        <option>Delivered</option>
                      </select>

                      <button
                        type="button"
                        className="button"
                        onClick={() => updateStatus(bag._id, "Loaded")}
                      >
                        Loaded
                      </button>

                      <button
                        type="button"
                        className="button"
                        onClick={() => updateStatus(bag._id, "Delivered")}
                      >
                        Delivered
                      </button>
                    </div>
                  </td>

                  <td style={{ color: "#a9b4cc" }}>{formatDate(bag.updatedAt)}</td>

                  <td className="actionsCol">
                    <div className="actions">
                      <button
                        type="button"
                        className="actionBtn edit"
                        onClick={() => startEdit(bag)}
                        title="Edit bag"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="actionBtn delete"
                        onClick={() => deleteBag(bag._id)}
                        title="Delete bag"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredBags.length === 0 && (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", color: "#a9b4cc" }}>
                    No bags found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
