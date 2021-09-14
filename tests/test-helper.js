import Application from "../app";
import config from "../config/environment";
import { setApplication } from "@ember/test-helpers";
import { start } from "ember-qunit";
import "ember-cli-testdouble-qunit";

import "./assertions/dom";

setApplication(Application.create(config.APP));

start();
