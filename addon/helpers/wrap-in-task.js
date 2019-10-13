import Helper from "@ember/component/helper";
import { defineProperty } from "@ember/object";
import { task } from "ember-concurrency";

/**
 * @argument {string} type
 * @argument {GeneratorFunction} fn
 */
function getTask(type, fn) {
  let taskProp = task(fn);

  if (type) {
    taskProp = taskProp[type]();
  }

  return taskProp;
}

export default Helper.extend({
  compute([action], { type }) {
    this.action = action;

    defineProperty(
      this,
      "task",
      getTask(type, function*(...args) {
        return yield this.action(...args);
      })
    );

    return this.task;
  }
});
