import React from "react";

interface Props {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SignupInput({ label, type, value, onChange }: Props) {
  return (
    <div className = "signup-input-group">
      <label className = "signup-label">
        {label}
        <input
          type = {type}
          value = {value}
          onChange = {onChange}
          required
          className = "signup-input"
        />
      </label>
    </div>
  );
}
