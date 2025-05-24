import React, { useState } from 'react';

const JOBS_PER_PAGE = 10;

const Jobs = ({ jobs }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const startIdx = (page - 1) * JOBS_PER_PAGE;
  const endIdx = startIdx + JOBS_PER_PAGE;
  const jobsToShow = jobs.slice(startIdx, endIdx);

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 flex flex-col gap-6">
      {jobsToShow.map(job => (
        <div
          key={job.id}
          className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <h3 className="text-xl font-bold text-blue-800">{job.title}</h3>
              <div className="text-gray-600">{job.company} &middot; {job.location}</div>
              {job.salary && <div className="text-green-700 font-semibold">Salary: {job.salary}</div>}
              <div className="text-sm text-gray-500">{job.type}</div>
            </div>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
            >
              Apply
            </a>
          </div>
          <div className="mt-2 text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: job.snippet }} />
          <div className="text-xs text-gray-400 mt-2">
            Source: {job.source} &middot; Updated: {job.updated && job.updated.slice(0, 10)}
          </div>
        </div>
      ))}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-5 mb-10">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={`px-3 py-1 rounded ${page === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;