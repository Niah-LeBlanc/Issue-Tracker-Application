"use client"
import { useState } from "react";
import bugCreateSchema from "../schemas/bugCreateSchema";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import { z } from "zod";



function AddBugModal({ onClose }: { onClose: () => void }) {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const showSuccess = (message: string) => {
    toast(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const reportBug = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      title,
      description,
      stepsToReproduce
    };

  try {
    const validatedData = bugCreateSchema.parse(updatedData);
    await api.post(`/api/bugs/new`, validatedData);
    showSuccess("Bug created successfully");
    onClose();
    navigate(0); // Refresh the page to show the new bug
    
  } catch (err) {
    if (err instanceof z.ZodError) {
            const fieldErrors: Record<string, string> = {};
            err.issues.forEach((issue) => {
              if (issue.path.length > 0) {
                fieldErrors[issue.path[0] as string] = issue.message;
              }
            });
            setValidationErrors(fieldErrors);
            return;
          }
    showError("Failed to Add Bug");
    console.error("Error updating profile:", err);
  }
}


  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Report Bug</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div> 
              <label>Bug Title:</label>
              <input type="text" placeholder="Enter bug title" required onChange={(e) => setTitle(e.target.value)} />
              {validationErrors.title && (
                  <p className="text-sm text-red-500">{validationErrors.title}</p>
                )}
            </div>
            <div>
              <label>Description:</label>
              <textarea
                placeholder="Write your review (optional)..."
                onChange={(e) => setDescription(e.target.value)}
                required
              />
                {validationErrors.bugDescription && (
                  <p className="text-sm text-red-500">{validationErrors.bugDescription}</p>
                )}
            </div>
            <div>
              <label>Steps to Reproduce:</label>
              <textarea
                placeholder="List the steps to reproduce the bug..."
                onChange={(e) => setStepsToReproduce(e.target.value)}
                required
              />
              {validationErrors.stepsToReproduce && (
                  <p className="text-sm text-red-500">{validationErrors.stepsToReproduce}</p>
                )}
            </div>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button type="button" className="btn-secondary ratingModalButton" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary ratingModalButton" onClick={(e) => reportBug(e)}>
                Submit Bug
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddBugModal
