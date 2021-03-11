import Helper from "@ember/component/helper";
import { defineProperty } from "@ember/object";
import { task } from "ember-concurrency";

/**
 * @argument {string} type
 * @argument {GeneratorFunction} fn
 */
function getTask(type, maxConcurrency, fn) {
  let taskProp = task(fn);

  if (type) {
    taskProp = taskProp[type]();
  }

  if (maxConcurrency) {
    taskProp = taskProp.maxConcurrency(maxConcurrency);
  }

  return taskProp;
}

export default class WrapInTaskHelper extends Helper {
  compute([action], { maxConcurrency, type }) {
    this.action = action;

    defineProperty(
      this,
      "task",
      getTask(type, maxConcurrency, function* (...args) {
        return yield this.action(...args);
      })
    );

    return this.task;
  }
}
