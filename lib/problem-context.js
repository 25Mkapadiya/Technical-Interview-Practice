(function () {
  'use strict';
  if (!window.ProblemEngine?.enrich) return;
  window.InterviewLabContext = window.InterviewLabContext || { currentProblem: null };
  const previousEnrich = window.ProblemEngine.enrich;
  window.ProblemEngine.enrich = function contextAwareEnrich(problem) {
    const enriched = previousEnrich(problem);
    if (problem?.id !== 'ui-current') window.InterviewLabContext.currentProblem = enriched;
    return enriched;
  };
})();
