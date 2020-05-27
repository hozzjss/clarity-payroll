import {
  Client,
  Provider,
  ProviderRegistry,
  Result,
} from "@blockstack/clarity";
import { assert } from "chai";

describe("payroll contract unit test suite", () => {
  let payrollClient: Client;
  let provider: Provider;

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    payrollClient = new Client(
      "ST3PT63RKC10QYE20XDNPD01JVNG27QZ0D5D9N0V1.payroll",
      "payroll",
      provider
    );
  });

  it("should have a valid syntax", async () => {
    await payrollClient.checkContract();
  });

  describe("deploying an instance of the contract", () => {
    before(async () => {
      await payrollClient.deployContract();
    });

    it("should return current funds", async () => {
      const query = payrollClient.createQuery({
        method: { name: "get-current-funds", args: [] },
      });
      const receipt = await payrollClient.submitQuery(query);
      const result = Result.unwrapUInt(receipt);
      assert.equal(result, 0);
    });
  });

  after(async () => {
    await provider.close();
  });
});
