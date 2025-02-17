import React from 'react';
import './SearchByRoutesPage.css';

function SearchByRoutesPage() {

  return (
    <div className="search-by-route-page">
      <section className="intro">
        <h1>Search by Routes</h1>
        <p>
          See possible solutions between your origin and destination. Select from the programs you have points in, and compare them to make the best value!
        </p>
        <div className="intro-with-background">
          <p className="remark">
            * means this is an experienced rather than an officially published rule.
          </p>
          <p className="remark">^ means clicking to view more details.</p>
        </div>
      </section>

      <section className="program-details">
        <div className="block-container">
          <div className="block">
            1
          </div>
        </div>
      </section>
    </div>
  );
}

export default SearchByRoutesPage;
