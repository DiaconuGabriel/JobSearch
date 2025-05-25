import React, { useState } from 'react';

const JOBS_PER_PAGE = 10;
const PAGINATION_WINDOW = 5;

function calculateMatchPercentage(keywordsWithScores, snippet, title, seniorityWithScores) {
  const snippetText = snippet ? snippet.toLowerCase() : "";
  const titleText = title ? title.toLowerCase() : "";

  let totalScore = 0;
  let maxScore = 0;

  keywordsWithScores.forEach(({ word, score }) => {
    maxScore += score * 1.1;
    if (titleText.includes(word)) totalScore += score * 1.2;
    else if (snippetText.includes(word)) totalScore += score;
  });

  //Seniority bonus
  let seniorityBonus = 0;
  seniorityWithScores.forEach(({ word, score }) => {
    if (titleText.includes(word)) seniorityBonus += score;
    else if (snippetText.includes(word)) seniorityBonus += Math.round(score * 0.1);
  });

  //Final score calculation
  const percentScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  return Math.min(100, percentScore + seniorityBonus);
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

const Jobs = ({ jobs, keywordsObj, seniorityKeywordsObj }) => {
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
      job.title,
      seniorityWithScores
    )
  }));

  const sortedJobs = jobsWithMatch.sort((a, b) => b.match - a.match);

  const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE);
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
              <div className="text-sm text-purple-700 font-semibold mt-1">
                Match: {job.match}%
              </div>
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

      {totalPages > 1 && (
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