export const LEDGER_PERSISTENCE = "IN-MEMORY";

export function createOperationLedger() {
  return {
    persistence: LEDGER_PERSISTENCE,
    operations: new Map(),
    issuedByParent: new Map(),
  };
}

let shared = createOperationLedger();

export function defaultLedger() {
  return shared;
}

export function resetDefaultLedger() {
  shared = createOperationLedger();
  return shared;
}

export function recallOperation(ledger, operationId) {
  return ledger.operations.get(operationId) ?? null;
}

export function nextDescendantId(ledger, parentThingId) {
  const issued = ledger.issuedByParent.get(parentThingId) ?? [];
  return `DERIVATIVE://0041-${String.fromCharCode(65 + issued.length)}`;
}

export function rememberOperation(ledger, record) {
  const operationId = record.operationId;
  ledger.operations.set(operationId, record);
  const parentThingId = record.parentThingId;
  const issued = ledger.issuedByParent.get(parentThingId) ?? [];
  const childId = record.derivative.thingId;
  if (!issued.includes(childId)) {
    ledger.issuedByParent.set(parentThingId, [...issued, childId]);
  }
  return record;
}
