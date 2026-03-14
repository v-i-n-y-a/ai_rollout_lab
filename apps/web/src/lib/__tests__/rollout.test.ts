import { rolloutBucket, isInRollout } from "../rollout";

describe("rollout (flag evaluation)", () => {
  describe("rolloutBucket", () => {
    it("returns 0–99 for any string", () => {
      expect(rolloutBucket("")).toBeGreaterThanOrEqual(0);
      expect(rolloutBucket("")).toBeLessThan(100);
      expect(rolloutBucket("user-1")).toBeGreaterThanOrEqual(0);
      expect(rolloutBucket("user-1")).toBeLessThan(100);
    });

    it("is deterministic for the same identifier", () => {
      expect(rolloutBucket("session-abc")).toBe(rolloutBucket("session-abc"));
      expect(rolloutBucket("user-42")).toBe(rolloutBucket("user-42"));
    });

    it("differs for different identifiers", () => {
      const a = rolloutBucket("a");
      const b = rolloutBucket("b");
      expect(a).not.toBe(b);
    });
  });

  describe("isInRollout", () => {
    it("returns false for 0%", () => {
      expect(isInRollout("any-id", 0)).toBe(false);
    });

    it("returns true for 100%", () => {
      expect(isInRollout("any-id", 100)).toBe(true);
    });

    it("returns true when bucket < rolloutPercent", () => {
      const id = "id-bucket-5";
      const bucket = rolloutBucket(id);
      expect(bucket).toBeLessThan(100);
      expect(isInRollout(id, bucket + 1)).toBe(true);
      expect(isInRollout(id, 100)).toBe(true);
    });

    it("returns false when bucket >= rolloutPercent", () => {
      const id = "id-bucket-50";
      const bucket = rolloutBucket(id);
      expect(isInRollout(id, bucket)).toBe(false);
      expect(isInRollout(id, 0)).toBe(false);
    });
  });
});
