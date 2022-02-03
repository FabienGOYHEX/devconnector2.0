import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
    return <div className="alert-wrapper">
        {alerts.map((alert) => (
            <div key={alert.id} className={`alert alert-${alert.alertType}`}>
                {alert.msg}
            </div>
        ))}
    </div>;
};

const mapStateToProps = state => ({
    alerts: state.alert
})

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(Alert);
