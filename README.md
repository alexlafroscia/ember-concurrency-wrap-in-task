# ember-concurrency-wrap-in-task

Ember helper for wrapping a function in an [`ember-concurrency`](https://github.com/machty/ember-concurrency) task.

## Usage

This addon is to help migrate from using an async Ember Action to Ember Concurrency tasks.

Rather than having to re-write your JS code to take advantage of the derived state that Ember Concurrency provides, you can pass an action through this helper to receive a task that wraps it.

```handlebars
{{#let (wrap-in-task @someArgumentFunction) as |task|}}
  <button {{on "click" (perform task)}} disabled={{task.isRunning}}>
    {{if task.isRunning "Running..." "Run"}}
  </button>
{{/let}}
```

A "task type" (`drop`, `keepLatest`) can be provided as a named parameter to the helper. `maxConcurrency` can also be configured in a similar way.

```handlebars
{{wrap-in-task @someArgumentFunction type="drop" maxConcurrency=3}}
```

## Installation

```bash
yarn add ember-concurrency ember-concurrency-wrap-in-task
```

## Compatibility

- Ember.js v3.20 or above

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
