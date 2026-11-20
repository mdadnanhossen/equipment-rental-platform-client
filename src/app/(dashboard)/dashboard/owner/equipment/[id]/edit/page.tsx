
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type {
  Equipment,
  EquipmentCondition,
  EquipmentImage,
} from "@/types/equipment";
import { uploadEquipmentImages } from "@/lib/api/equipment";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
  "Construction",
  "Photography",
  "Electronics",
  "Tools",
  "Vehicles",
  "Agriculture",
  "Other",
];

export default function EditEquipmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<EquipmentImage[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    model: "",
    pricePerDay: "",
    securityDeposit: "",
    condition: "good" as EquipmentCondition,
    city: "",
    address: "",
    availability: "available",
  });

  useEffect(() => {
    async function loadEquipment() {
      try {
        const response = await fetch(
          `${API_URL}/api/equipment/my-equipment/${id}`,
          { credentials: "include" }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load equipment");
        }

        const item: Equipment = result.data;
        setEquipment(item);
        setExistingImages(item.images || []);

        setForm({
          title: item.title,
          description: item.description,
          category: item.category,
          brand: item.brand || "",
          model: item.model || "",
          pricePerDay: String(item.pricePerDay),
          securityDeposit: String(item.securityDeposit || 0),
          condition: item.condition,
          city: item.location.city,
          address: item.location.address,
          availability: item.availability,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) loadEquipment();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);

    if (existingImages.length + files.length + selected.length > 5) {
      setError("Maximum 5 images are allowed.");
      e.target.value = "";
      return;
    }

    if (
      selected.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
            file.type
          ) || file.size > 5 * 1024 * 1024
      )
    ) {
      setError("Use JPG, PNG, WEBP or GIF images under 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setFiles((previous) => [...previous, ...selected]);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let newImages: EquipmentImage[] = [];

      if (files.length > 0) {
        newImages = await uploadEquipmentImages(files);
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        brand: form.brand.trim(),
        model: form.model.trim(),
        pricePerDay: Number(form.pricePerDay),
        securityDeposit: Number(form.securityDeposit || 0),
        condition: form.condition,
        images: [...existingImages, ...newImages],
        location: {
          city: form.city.trim(),
          address: form.address.trim(),
        },
        availability: form.availability,
      };

      const response = await fetch(`${API_URL}/api/equipment/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update equipment");
      }

      router.push("/dashboard/owner/equipment");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading equipment...</div>;

  if (error && !equipment) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!equipment) {
    return <div className="p-6">Equipment not found.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Equipment</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            required
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            required
            rows={4}
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select
              required
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Condition</label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            >
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Brand</label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Model</label>
            <input
              name="model"
              value={form.model}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Price Per Day</label>
            <input
              required
              min="1"
              type="number"
              name="pricePerDay"
              value={form.pricePerDay}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Security Deposit
            </label>
            <input
              min="0"
              type="number"
              name="securityDeposit"
              value={form.securityDeposit}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <input
              required
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Address</label>
            <input
              required
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Availability</label>
          <select
            name="availability"
            value={form.availability}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Current Images</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {existingImages.map((image, index) => (
              <div key={image.publicId || image.url} className="relative">
                <img
                  src={image.url}
                  alt={`Equipment ${index + 1}`}
                  className="h-32 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setExistingImages((previous) =>
                      previous.filter((_, i) => i !== index)
                    )
                  }
                  className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Add More Images
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleFiles}
            className="w-full rounded-lg border p-3"
          />
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="mt-2 flex items-center justify-between text-sm"
            >
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() =>
                  setFiles((previous) =>
                    previous.filter((_, i) => i !== index)
                  )
                }
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-black p-3 font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Update Equipment"}
        </button>
      </form>
    </div>
  );
}
