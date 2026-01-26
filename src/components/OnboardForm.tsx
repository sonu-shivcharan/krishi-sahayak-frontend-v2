import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function OnboardForm() {
  const { getToken } = useAuth();

  const [form, setForm] = useState({
    name: "",
    address: "",
    location: null as null | { type: "Point"; coordinates: [number, number] },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locStatus, setLocStatus] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function getLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLocStatus("Getting location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;

        setForm({
          ...form,
          location: {
            type: "Point",
            coordinates: [lng, lat], // IMPORTANT: lng, lat
          },
        });

        setLocStatus("Location added ✅");
      },
      () => {
        setLocStatus("Location permission denied");
      },
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const token = await getToken();

      const res = await fetch("http://localhost:3000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Onboarding failed");

      alert("Onboarding completed 🎉");
    } catch (err) {
      console.log("err", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>User Onboarding</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <Input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        required
      />

      <Button type="button" onClick={getLocation}>
        Add Location (Optional)
      </Button>

      {locStatus && <p>{locStatus}</p>}

      <Button disabled={loading}>
        {loading ? "Submitting..." : "Complete Onboarding"}
      </Button>
    </form>
  );
}
