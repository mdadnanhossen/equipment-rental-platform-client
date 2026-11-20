
"use client";

import { useState } from "react";
import { uploadEquipmentImages } from "@/lib/api/equipment";
import type {
  EquipmentCondition,
  EquipmentImage,
  CreateEquipmentPayload,
} from "@/types/equipment";

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

export default function AddEquipmentForm() {
  const [formData, setFormData] = useState({
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
  });

  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<EquipmentImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + files.length > 5) {
      setError("Maximum 5 images are allowed.");
      e.target.value = "";
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type
      )
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Only JPG, PNG, WEBP and GIF images are allowed.");
      return;
    }

    if (selectedFiles.some((file) => file.size > 5 * 1024 * 1024)) {
      setError("Each image must be smaller than 5 MB.");
      return;
    }

    setError("");
    setFiles((previous) => [...previous, ...validFiles]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setFiles((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (files.length === 0) {
      setError("Please select at least one equipment image.");
      return;
    }

    try {
      setUploading(true);

      const uploadedImages = await uploadEquipmentImages(files);
      setImages(uploadedImages);
      setUploading(false);
      setSubmitting(true);

      const payload: CreateEquipmentPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        pricePerDay: Number(formData.pricePerDay),
        securityDeposit: Number(formData.securityDeposit || 0),
        condition: formData.condition,
        images: uploadedImages,
        location: {
          city: formData.city.trim(),
          address: formData.address.trim(),
        },
      };

      const response = await fetch(`${API_URL}/api/equipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to add equipment"
        );
      }

      setSuccess(
        "Equipment submitted successfully! Waiting for admin approval."
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        brand: "",
        model: "",
        pricePerDay: "",
        securityDeposit: "",
        condition: "good",
        city: "",
        address: "",
      });

      setFiles([]);
      setImages([]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-2xl font-bold">
        Add Equipment
      </h2>

      <p className="mb-6 text-sm text-gray-500">
        Provide equipment details and upload clear images.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Equipment Title
          </label>
          <input
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Canon DSLR Camera"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Description
          </label>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your equipment..."
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Category
            </label>
            <select
              required
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Condition
            </label>
            <select
              name="condition"
              value={formData.condition}
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
            <label className="mb-1 block text-sm font-medium">
              Brand
            </label>
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Model
            </label>
            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Model"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Price Per Day
            </label>
            <input
              required
              min="1"
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              placeholder="1000"
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
              value={formData.securityDeposit}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              City
            </label>
            <input
              required
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Khulna"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Full Address
            </label>
            <input
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your equipment location"
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Equipment Images (Maximum 5)
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleFileChange}
            className="w-full rounded-lg border p-3"
          />

          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="relative"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={uploading || submitting}
          className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading
            ? "Uploading Images..."
            : submitting
              ? "Submitting Equipment..."
              : "Submit Equipment"}
        </button>
      </form>
    </div>
  );
}
