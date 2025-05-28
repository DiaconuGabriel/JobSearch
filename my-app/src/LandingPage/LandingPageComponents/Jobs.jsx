import React, { useState} from 'react';

const JOBS_PER_PAGE = 10;
const PAGINATION_WINDOW = 5;
const MAX_JOBS_TO_SHOW = 100;

function calculateMatchPercentage(keywordsWithScores, snippet, location, title, seniorityWithScores, actlocation = "") {
  const snippetText = snippet ? snippet.toLowerCase() : "";
  const titleText = title ? title.toLowerCase() : "";
  const locationText = location ? location.toLowerCase() : "";
  const actlocationText = actlocation ? actlocation.toLowerCase() : "";

  let matchedScore = 0;
  let maxScore = 0;
  keywordsWithScores.forEach(({ word, score }) => {
    maxScore += score;
    if (titleText.includes(word) || snippetText.includes(word)) {
      matchedScore += score;
    }
  });

  let seniorityBonus = 0;
  seniorityWithScores.forEach(({ word, score }) => {
    if (titleText.includes(word)) {
      seniorityBonus = Math.max(seniorityBonus, score);
    }
  });

  let locationBonus = 0;
  if (actlocationText && locationText.includes(actlocationText)) {
    locationBonus = 10;
  }

  const percentScore = maxScore > 0 ? (matchedScore / maxScore) * 100 : 0;
  const finalScore = Math.min(100, Math.round(percentScore + seniorityBonus + locationBonus));
  return finalScore;
}

function removeDuplicates(jobs) {
  const seen = new Set();
  return jobs.filter(job => {
    const key = job.link || job.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const JobCard = ({ job }) => (
  <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-gray-100">
    <div className="flex flex-row justify-between items-center gap-4">
      <div className="flex flex-col items-center min-w-[70px]">
        <img
          src={`https://jobsearch-n4zw.onrender.com/get-logo?company=${encodeURIComponent(job.company)}&source=${encodeURIComponent(job.source)}`}
          alt={job.company}
          className="w-12 h-12 object-contain rounded mb-2 border"
          onError={e => { e.target.src = 'https://placehold.co/40x40?text=?'; }}
        />
        <div className="text-purple-700 font-bold text-lg">{job.match}%</div>
        <div className="text-xs text-gray-400">Match</div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
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
          className="mt-2 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition text-center"
        >
          Apply
        </a>
      </div>
    </div>
    <div className="mt-2 text-gray-700 text-sm break-words" dangerouslySetInnerHTML={{ __html: job.snippet }} />
    <div className="text-xs text-gray-400 mt-2">
      Source: {job.source} &middot; Updated: {job.updated && job.updated.slice(0, 10)}
    </div>
  </div>
);

const Jobs = ({ jobs, keywordsObj, seniorityKeywordsObj, loading, selectedLocation,  }) => {
  const [page, setPage] = useState(1);

  const uniqueJobs = removeDuplicates(jobs);

  const keywordsWithScores = Object.entries(keywordsObj || {}).map(([word, score]) => ({
    word: word.toLowerCase(),
    score
  }));
  const seniorityWithScores = Object.entries(seniorityKeywordsObj || {}).map(([word, score]) => ({
    word: word.toLowerCase(),
    score
  }));

  const jobsWithMatch = uniqueJobs.map(job => ({
    ...job,
    match: calculateMatchPercentage(
      keywordsWithScores,
      job.snippet,
      job.location,
      job.title,
      seniorityWithScores,
      selectedLocation 
    )
  }));

  const sortedJobs = jobsWithMatch.sort((a, b) => b.match - a.match).slice(0, MAX_JOBS_TO_SHOW);

  const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE);
  const showPagination = sortedJobs.length > JOBS_PER_PAGE;
  const startIdx = (page - 1) * JOBS_PER_PAGE;
  const endIdx = startIdx + JOBS_PER_PAGE;
  const jobsToShow = sortedJobs.slice(startIdx, endIdx);

  const currentWindow = Math.floor((page - 1) / PAGINATION_WINDOW);
  const windowStart = currentWindow * PAGINATION_WINDOW + 1;
  const windowEnd = Math.min(windowStart + PAGINATION_WINDOW - 1, totalPages);
  const pageNumbers = [];
  for (let i = windowStart; i <= windowEnd; i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 flex justify-center items-center h-40">
        <span className="text-lg text-gray-500 animate-pulse">Looking for jobs...</span>
      </div>
    );
  }

  if (!loading && (!jobsToShow || jobsToShow.length === 0)) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 flex justify-center items-center h-40">
        <span className="text-lg text-gray-500">No jobs found.</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 flex flex-col gap-6">
      {jobsToShow.map(job => (
        <JobCard
          key={job.id}
          job={job}
        />
      ))}

      {showPagination && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-5 mb-10">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setPage(Math.max(1, windowStart - 1))}
            disabled={windowStart === 1}
          >
            Prev
          </button>
          {pageNumbers.map(num => (
            <button
              key={num}
              className={`px-3 py-1 rounded ${page === num ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setPage(Math.min(totalPages, windowEnd + 1))}
            disabled={windowEnd === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;