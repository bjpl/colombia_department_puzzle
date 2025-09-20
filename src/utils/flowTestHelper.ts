/**
 * Flow Test Helper - Automated testing utilities for user flows
 * This helper simulates different user scenarios for testing
 */

interface TestScenario {
  name: string;
  description: string;
  setup: () => void;
  expectedBehavior: string[];
  validate?: () => boolean;
}

export class FlowTestHelper {
  private scenarios: TestScenario[] = [
    {
      name: 'first-time-user',
      description: 'Brand new user with no data',
      setup: () => {
        localStorage.clear();
        sessionStorage.clear();
      },
      expectedBehavior: [
        'QuickStart modal should appear',
        'No tutorial shown yet',
        'No previous game state'
      ],
      validate: () => {
        const settings = localStorage.getItem('colombiaPuzzle_settings');
        const profile = localStorage.getItem('colombiaPuzzle_activeProfile');
        return !settings && !profile;
      }
    },
    {
      name: 'returning-user-no-tutorial',
      description: 'User with profile but hasn\'t seen tutorial',
      setup: () => {
        localStorage.clear();
        localStorage.setItem('colombiaPuzzle_activeProfile', JSON.stringify({
          id: 'test-user',
          name: 'Test User',
          stats: { gamesPlayed: 1 }
        }));
        localStorage.setItem('colombiaPuzzle_settings', JSON.stringify({
          tutorialShown: false
        }));
      },
      expectedBehavior: [
        'Tutorial modal should appear',
        'No QuickStart shown',
        'Previous stats preserved'
      ],
      validate: () => {
        const settings = JSON.parse(localStorage.getItem('colombiaPuzzle_settings') || '{}');
        return settings.tutorialShown === false;
      }
    },
    {
      name: 'experienced-user',
      description: 'User who has seen tutorial and played before',
      setup: () => {
        localStorage.clear();
        localStorage.setItem('colombiaPuzzle_activeProfile', JSON.stringify({
          id: 'exp-user',
          name: 'Experienced User',
          stats: { gamesPlayed: 10 }
        }));
        localStorage.setItem('colombiaPuzzle_settings', JSON.stringify({
          tutorialShown: true,
          soundEnabled: true,
          vibrationEnabled: false
        }));
        localStorage.setItem('colombiaPuzzle_gameState', JSON.stringify({
          gameMode: { type: 'region', selectedRegions: ['Andina'] }
        }));
      },
      expectedBehavior: [
        'No modals appear',
        'Direct to game',
        'Previous game mode restored'
      ],
      validate: () => {
        const settings = JSON.parse(localStorage.getItem('colombiaPuzzle_settings') || '{}');
        const profile = JSON.parse(localStorage.getItem('colombiaPuzzle_activeProfile') || '{}');
        return settings.tutorialShown === true && profile.stats?.gamesPlayed > 5;
      }
    },
    {
      name: 'edge-case-no-departments',
      description: 'Invalid state with no active departments',
      setup: () => {
        localStorage.clear();
        // Simulate a broken state
        localStorage.setItem('colombiaPuzzle_gameState', JSON.stringify({
          gameMode: { type: 'region', selectedRegions: [] },
          activeDepartments: []
        }));
        localStorage.setItem('colombiaPuzzle_settings', JSON.stringify({
          tutorialShown: true
        }));
      },
      expectedBehavior: [
        'Fallback to Insular region',
        'At least 1 department active',
        'No crash or error'
      ],
      validate: () => {
        // This will be validated after the app loads
        return true;
      }
    },
    {
      name: 'progressive-mode-new',
      description: 'New user starting progressive mode',
      setup: () => {
        localStorage.clear();
        localStorage.setItem('colombiaPuzzle_gameState', JSON.stringify({
          gameMode: { type: 'progression' },
          regionProgress: new Map()
        }));
      },
      expectedBehavior: [
        'Starts with Insular region only',
        '5 hints available',
        'Other regions locked'
      ]
    },
    {
      name: 'regional-multi-select',
      description: 'Multiple regions selected',
      setup: () => {
        localStorage.clear();
        localStorage.setItem('colombiaPuzzle_gameState', JSON.stringify({
          gameMode: {
            type: 'region',
            selectedRegions: ['Caribe', 'Andina', 'Pacífica']
          }
        }));
        localStorage.setItem('colombiaPuzzle_settings', JSON.stringify({
          tutorialShown: true
        }));
      },
      expectedBehavior: [
        'All selected regions\' departments active',
        '3 hints available',
        'Correct department count'
      ]
    }
  ];

  /**
   * Run a specific test scenario
   */
  runScenario(scenarioName: string): void {
    const scenario = this.scenarios.find(s => s.name === scenarioName);
    if (!scenario) {
      console.error(`❌ Scenario '${scenarioName}' not found`);
      return;
    }

    console.group(`🧪 Testing: ${scenario.name}`);
    console.log(`📝 ${scenario.description}`);

    // Setup the scenario
    console.log('🔧 Setting up...');
    scenario.setup();

    // Log expected behavior
    console.log('✅ Expected behavior:');
    scenario.expectedBehavior.forEach(behavior => {
      console.log(`  • ${behavior}`);
    });

    // Validate if provided
    if (scenario.validate) {
      const isValid = scenario.validate();
      console.log(isValid ? '✅ Setup validated' : '❌ Setup validation failed');
    }

    console.log('🔄 Refresh the page to see the scenario in action');
    console.groupEnd();
  }

  /**
   * List all available test scenarios
   */
  listScenarios(): void {
    console.group('📋 Available Test Scenarios');
    this.scenarios.forEach(scenario => {
      console.log(`• ${scenario.name}: ${scenario.description}`);
    });
    console.groupEnd();
  }

  /**
   * Run all scenarios sequentially (requires manual page refreshes)
   */
  runAll(): void {
    console.log('🏃 Running all test scenarios...');
    console.log('⚠️ You\'ll need to refresh the page between each scenario');

    let currentIndex = 0;

    const runNext = () => {
      if (currentIndex < this.scenarios.length) {
        const scenario = this.scenarios[currentIndex];
        this.runScenario(scenario.name);
        currentIndex++;

        console.log(`\n⏭️ After testing, run: flowTest.continueAll()`);
        // Store state for continuation
        sessionStorage.setItem('flowTest_currentIndex', currentIndex.toString());
      } else {
        console.log('✅ All scenarios completed!');
        sessionStorage.removeItem('flowTest_currentIndex');
      }
    };

    runNext();
  }

  /**
   * Continue running all scenarios from where we left off
   */
  continueAll(): void {
    const savedIndex = sessionStorage.getItem('flowTest_currentIndex');
    if (!savedIndex) {
      console.log('ℹ️ No test in progress. Use runAll() to start');
      return;
    }

    const currentIndex = parseInt(savedIndex);
    if (currentIndex < this.scenarios.length) {
      const scenario = this.scenarios[currentIndex];
      this.runScenario(scenario.name);
      sessionStorage.setItem('flowTest_currentIndex', (currentIndex + 1).toString());

      if (currentIndex + 1 < this.scenarios.length) {
        console.log(`\n⏭️ After testing, run: flowTest.continueAll()`);
      } else {
        console.log('✅ All scenarios completed!');
        sessionStorage.removeItem('flowTest_currentIndex');
      }
    }
  }

  /**
   * Check current application state
   */
  checkState(): void {
    console.group('🔍 Current Application State');

    // Check localStorage
    const settings = localStorage.getItem('colombiaPuzzle_settings');
    const profile = localStorage.getItem('colombiaPuzzle_activeProfile');
    const gameState = localStorage.getItem('colombiaPuzzle_gameState');

    console.log('Settings:', settings ? JSON.parse(settings) : 'None');
    console.log('Profile:', profile ? JSON.parse(profile) : 'None');
    console.log('Game State:', gameState ? JSON.parse(gameState) : 'None');

    // Check sessionStorage
    const testIndex = sessionStorage.getItem('flowTest_currentIndex');
    if (testIndex) {
      console.log('Test in progress at index:', testIndex);
    }

    console.groupEnd();
  }

  /**
   * Reset to clean state
   */
  reset(): void {
    console.log('🧹 Clearing all data...');
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ Reset complete. Refresh the page to see clean state.');
  }
}

// Create global instance for console access
if (typeof window !== 'undefined') {
  (window as any).flowTest = new FlowTestHelper();
  console.log('🧪 Flow Test Helper loaded! Use flowTest.listScenarios() to see available tests.');
}