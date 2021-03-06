var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var test = require('tape');
var sinon = require('sinon');
var vanillaFocusTrap = require('focus-trap');
var FocusTrap = require('../');

var deactivateSpy = sinon.spy(vanillaFocusTrap, 'deactivate');

test('deactivation', function(t) {
  var handleDeactivation = sinon.spy();
  var domContainer = setup();

  var TestZone = React.createClass({
    getInitialState: function() {
      return {
        trapActive: true,
      };
    },

    deactivateTrap: function() {
      this.setState({ trapActive: false });
    },

    render: function() {
      return (
        <div>
          <button
            ref='trigger'
            onClick={this.deactivateTrap}
          >
            deactivate
          </button>
          <FocusTrap
            ref='trap'
            onDeactivate={handleDeactivation}
            active={this.state.trapActive}
          >
            <button>
              something special
            </button>
          </FocusTrap>
        </div>
      )
    },
  })

  var zone = ReactDOM.render(<TestZone />, domContainer);

  t.notOk(deactivateSpy.called);

  TestUtils.Simulate.click(ReactDOM.findDOMNode(zone.refs.trigger));

  t.ok(deactivateSpy.calledOnce);
  t.ok(handleDeactivation.calledOnce);

  teardown();
  t.end();
});

test('deactivation by dismount', function(t) {
  var handleDeactivation = sinon.spy();
  var domContainer = setup();

  var TestZone = React.createClass({
    getInitialState: function() {
      return {
        trapActive: true,
      };
    },

    deactivateTrap: function() {
      this.setState({ trapActive: false });
    },

    render: function() {
      var trap = (this.state.trapActive) ? (
        <FocusTrap
          ref='trap'
          onDeactivate={handleDeactivation}
        >
          <button>
            something special
          </button>
        </FocusTrap>
      ) : false;

      return (
        <div>
          <button
            ref='trigger'
            onClick={this.deactivateTrap}
          >
            deactivate
          </button>
          {trap}
        </div>
      )
    },
  })

  var zone = ReactDOM.render(<TestZone />, domContainer);

  t.notOk(deactivateSpy.called);

  TestUtils.Simulate.click(ReactDOM.findDOMNode(zone.refs.trigger));

  t.ok(deactivateSpy.calledOnce);
  t.ok(handleDeactivation.calledOnce);

  teardown();
  t.end();
});

var domContainer;

function setup() {
  deactivateSpy.reset();
  domContainer = document.createElement('div');
  document.body.appendChild(domContainer);
  return domContainer;
}

function teardown() {
  ReactDOM.unmountComponentAtNode(domContainer);
  document.body.removeChild(domContainer);
}
