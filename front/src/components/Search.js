import React from "react";

export default function Search() {
  return (
    <header>
      <form className="search-form" id="search-form" onSubmit={handleSubmit}>
        <input
          className="search-form-input"
          type="search"
          placeholder="Enter city"
          value={query}
          onChange={handleChange}
          required
        />
        <input className="search-form-button" type="submit" value="Search" />
      </form>
    </header>
  );
}
