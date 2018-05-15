class UpgradeModalContainer extends React.Component<Props, State> {
    constructor(props) {
        super(props);
    }
    state = {
        initialTier: this.props.tier
    }
    render() {
        const {orgId, toggle} = this.props;
        const {initialTier} = this.props;
        if (initialTier === PRO) {
            return null;
        }
        return (
            <LoadableModal
            LoadableComponent={UpgradeModalRootLoadable}
            maxWidth={350}
            maxHeight={225}
            queryVars={{orgId}}
            toggle={toggle}
          />
        )
    }
}