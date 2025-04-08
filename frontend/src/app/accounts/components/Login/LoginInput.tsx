import React from "react";

interface Props {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LoginInput({ label, type, value, onChange }: Props) {
  return (
    <div className="login-input-group">
      <label className="login-label">
        {label}
        <input
          type={type}
          value={value}
          onChange={onChange}
          required
          className="login-input"
        />
      </label>
    </div>
  );
}
