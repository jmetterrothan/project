import React from 'react';

import NotificationContainer from '@public/components/Notification/NotificationContainer';
import UIState from '@ui/UIState';
import UIHomeState from '@ui/states/UIHomeState';
import stateFactory from '@ui/UIStatesFactory';
import withUIManager from '@public/components/withUIManager/withUIManager';

import UIService, { uiSvc } from './services/ui.service';

import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UI_STATES } from '@ui/enums/UIStates.enum';

interface IUIManagerProps {

}

interface IUIManagerState {
  currentUiStateID: UI_STATES;
  parameters: IUIManagerParameters;
}

class UIManager extends React.PureComponent<IUIManagerProps, IUIManagerState> {
  static readonly ENABLED: boolean = true;

  private uiStates: Map<UI_STATES, UIState>;

  private uiSvc: UIService;

  constructor(props: IUIManagerProps, state: IUIManagerState) {
    super(props, state);

    this.uiSvc = uiSvc;

    this.state = {
      currentUiStateID: UI_STATES.HOME,
      parameters: {}
    };

    this.uiStates = new Map<UI_STATES, UIState>();

    this.addState(UI_STATES.HOME, new UIHomeState(null));
  }

  /*
  componentDidMount() {

      label: 'Trophy unlocked',
      content: 'This is a test notification',
      duration: 500000
    });
  }
  */

  render() {
    const uiState = this.uiStates.get(this.state.currentUiStateID);
    if (this.state.currentUiStateID === UI_STATES.HOME) uiState.process(this);

    return (
      <div className='ui'>
        <div className='ui__notifications pl-2 pt-2'>
          <NotificationContainer />
        </div>
        <div className='ui__state p-2'>
          {withUIManager(uiState.render())(this)}
        </div>
      </div>
    );
  }

  switchState(state: UI_STATES, parameters: IUIManagerParameters = {}) {
    if (!this.uiStates.has(state)) this.addState(state);
    this.setState({
      currentUiStateID: state,
      parameters: {
        ...this.state.parameters,
        ...parameters
      }
    }, async () => {
      this.uiSvc.switchState(state, parameters);
      await this.uiStates.get(state).process(this);
    });
  }

  manageMenu(open: boolean) {
    this.switchState(open ? UI_STATES.MENU : UI_STATES.GAME);
  }

  handleKeyboard(key: string) {
    switch (key) {
      // case 't': case 'T': this.manageMenu(true);
    }
  }

  private addState(key: UI_STATES, value?: UIState) {
    if (!this.uiStates.has(key)) {
      const uiState = value ? value : stateFactory(key);
      uiState.init();
      this.uiStates.set(key, uiState);
    }
  }

}

export default UIManager;
