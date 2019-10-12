import Helper from "@ember/component/helper";
import { task } from "ember-concurrency";

export default Helper.extend({
  task: task(function*(...args) {
    return yield this.action(...args);
  }),

  compute([action]) {
    this.action = action;

    return this.task;
  }
});
