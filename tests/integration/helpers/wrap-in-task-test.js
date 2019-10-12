import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { click, render, settled } from "@ember/test-helpers";
import { defer } from "rsvp";
import hbs from "htmlbars-inline-precompile";
import td from "testdouble";

module("Integration | Helper | wrap-in-task", function(hooks) {
  setupRenderingTest(hooks);

  test("passing arguments to the action", async function(assert) {
    this.action = td.function();

    await render(hbs`
      {{#let (wrap-in-task this.action) as |task|}}
        <button {{action (perform task) 'foobar'}}>
          Click Me
        </button>
      {{/let}}
    `);

    await click("button");

    assert.verify(
      this.action("foobar"),
      "The action is invoked with arguments"
    );
  });

  test("changing the action passed into the function", async function(assert) {
    const first = td.function();
    const second = td.function();
    this.action = first;

    await render(hbs`
      {{#let (wrap-in-task this.action) as |task|}}
        <button {{action (perform task)}}>
          Click Me
        </button>
      {{/let}}
    `);

    this.set("action", second);

    await click("button");

    assert.verify(
      first(),
      { ignoreExtraArgs: true, times: 0 },
      "The first action is not called"
    );

    assert.verify(second(), "The second action is called");
  });

  test("passing along the result of the action", async function(assert) {
    this.action = td.function();
    td.when(this.action()).thenReturn("foobar");

    await render(hbs`
      {{#let (wrap-in-task this.action) as |task|}}
        <div id="result">
          {{task.lastSuccessful.value}}
        </div>
        <button {{action (perform task)}}>
          Click Me
        </button>
      {{/let}}
    `);

    await click("button");

    assert
      .dom("#result")
      .hasText("foobar", "The task resulted in the return value of the action");
  });

  test("the task runs while action's result is unresolved", async function(assert) {
    const { resolve, promise } = defer();
    this.action = td.function();
    td.when(this.action()).thenReturn(promise);

    await render(hbs`
      {{#let (wrap-in-task this.action) as |task|}}
        <div id="result">
          {{task.lastSuccessful.value}}
        </div>
        <button {{action (perform task)}}>
          {{if task.isRunning 'Running...' 'Click Me'}}
        </button>
      {{/let}}
    `);

    await click("button");

    assert
      .dom("button")
      .hasText(
        "Running...",
        "The task is running while the action's promise is unresolved"
      );

    resolve("foobar");
    await settled();

    assert
      .dom("button")
      .hasText("Click Me", "The task finished when the promise resolves");
    assert
      .dom("#result")
      .hasText("foobar", "It results in the resolution of the promise");
  });
});
