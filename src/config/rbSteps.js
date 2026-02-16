export const RB_STEPS = [
  { path: '01-problem', stepNum: 1, title: 'Problem' },
  { path: '02-market', stepNum: 2, title: 'Market' },
  { path: '03-architecture', stepNum: 3, title: 'Architecture' },
  { path: '04-hld', stepNum: 4, title: 'HLD' },
  { path: '05-lld', stepNum: 5, title: 'LLD' },
  { path: '06-build', stepNum: 6, title: 'Build' },
  { path: '07-test', stepNum: 7, title: 'Test' },
  { path: '08-ship', stepNum: 8, title: 'Ship' },
];

export const RB_BASE = '/rb';

export function getStepByPath(pathSegment) {
  return RB_STEPS.find((s) => s.path === pathSegment);
}

export function getStepByNum(stepNum) {
  return RB_STEPS.find((s) => s.stepNum === stepNum);
}

export function getNextStepPath(currentStepNum) {
  const next = getStepByNum(currentStepNum + 1);
  return next ? `${RB_BASE}/${next.path}` : null;
}

export function getPrevStepPath(currentStepNum) {
  const prev = getStepByNum(currentStepNum - 1);
  return prev ? `${RB_BASE}/${prev.path}` : null;
}
